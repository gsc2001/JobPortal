import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ColDef, DataGrid, ValueFormatterParams } from '@material-ui/data-grid';
import React from 'react';
import useSWR from 'swr';
import userAPI from '../../api/user';
import { useTypedSelector } from '../../utils/hooks';
import { Job, User, EmployeeApplication, RatingMap, Applicant } from '../../utils/types';
import RateCell from '../../components/RateCell';
import { pushAlert } from '../../store/alerts';
import { useDispatch } from 'react-redux';
import { getRatingfromMap } from '../../utils';
import { useState } from 'react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

interface EmployeesProps {}

type sortFieldType = 'applicantName' | 'doj' | 'applicantRating' | 'jobTitle' | '';

const Employees: React.FC<EmployeesProps> = ({}) => {
    const userId = useTypedSelector(state => state.auth.user.id);
    const { data, error, mutate } = useSWR(`get-employee-${userId}`, () =>
        userAPI.getEmployees()
    );
    const dispatch = useDispatch();
    const [sort, setSort] = useState<{ field: sortFieldType; by: 1 | -1 | '' }>({
        field: '',
        by: ''
    });

    if (!data) return <div>Loading</div>;

    if (error) {
        return <div>Error!!</div>;
    }

    const onRate = (userId: string | undefined) => async (rating: number | '') => {
        if (rating === '' || !userId) return;
        try {
            const _res = await userAPI.rate(userId, rating);
            mutate();
        } catch (err) {
            if (err.errors) {
                err.errors.forEach((er: { msg: string }) =>
                    dispatch(pushAlert({ text: er.msg, type: 'error' }))
                );
            }
        }
    };

    const columns: ColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            valueFormatter: (params: ValueFormatterParams) => {
                return (params.getValue('applicant') as Partial<User>).name;
            },
            flex: 1,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: 'doj',
            headerName: 'Date of Joining',
            flex: 2,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: 'jobType',
            headerName: 'Job Type',
            valueFormatter: (params: ValueFormatterParams) => {
                return (params.getValue('job') as Partial<Job>).jobType;
            },
            flex: 1,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: 'jobTitle',
            headerName: 'Job Title',
            valueFormatter: (params: ValueFormatterParams) => {
                return (params.getValue('job') as Partial<Job>).name;
            },
            flex: 1,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: 'rate',
            headerName: 'Rate Employee',
            renderCell: (params: ValueFormatterParams) => {
                return (
                    <RateCell
                        ratingMap={
                            (params.getValue('applicant') as Partial<Applicant>)
                                .ratingMap as RatingMap
                        }
                        onRate={onRate(
                            (params.getValue('applicant') as Partial<User>)._id
                        )}
                    />
                );
            },
            flex: 1,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: 'avgRating',
            headerName: 'Average Rating',
            valueFormatter: (params: ValueFormatterParams) => {
                const ratingMap = (params.getValue('applicant') as Partial<Applicant>)
                    .ratingMap as RatingMap;

                const rating = getRatingfromMap(ratingMap);

                if (rating === -1) {
                    return '-';
                }
                return rating;
            },
            flex: 1,
            sortable: false,
            disableColumnMenu: true
        }
    ];

    const employees: EmployeeApplication[] = data.applications.map(
        (appl: EmployeeApplication) => ({
            ...appl,
            id: appl._id
        })
    );

    const sortField = sort.field;
    if (sortField !== '' && sort.by !== '') {
        employees.sort((a, b) => {
            if (sortField === 'applicantName') {
                return (a.applicant.name as string).localeCompare(
                    b.applicant.name as string
                );
            } else if (sortField === 'applicantRating') {
                const aRating = getRatingfromMap(a.applicant.ratingMap as RatingMap);
                const bRating = getRatingfromMap(b.applicant.ratingMap as RatingMap);
                return aRating - bRating;
            } else if (sortField === 'jobTitle') {
                return (a.job.name as string).localeCompare(b.job.name as string);
            } else {
                return new Date(a.doj).getTime() - new Date(b.doj).getTime();
            }
        });
        if (sort.by === -1) {
            employees.reverse();
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h3"> My Employees </Typography>
                {JSON.stringify(employees)}
            </Grid>
            <Grid item xs={9}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div style={{ height: 700, width: '100%' }}>
                            <DataGrid columns={columns} rows={employees} />
                        </div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box marginTop={2}>
                            <Typography variant="h4">Sorting</Typography>
                            <Divider />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Field</Typography>
                        <FormControl variant="outlined" style={{ width: '100%' }}>
                            <Select
                                fullWidth
                                margin="dense"
                                value={sort.field}
                                onChange={e =>
                                    setSort({
                                        ...sort,
                                        field: e.target.value as sortFieldType
                                    })
                                }
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="applicantName">Name</MenuItem>
                                <MenuItem value="applicantRating">Rating</MenuItem>
                                <MenuItem value="doj">Date of Joining</MenuItem>
                                <MenuItem value="jobTitle">Job Title</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Order</Typography>
                        <FormControl variant="outlined" style={{ width: '100%' }}>
                            <Select
                                fullWidth
                                margin="dense"
                                value={sort.by}
                                onChange={e =>
                                    setSort({
                                        ...sort,
                                        by: e.target.value as 1 | -1 | ''
                                    })
                                }
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={1}>Ascending</MenuItem>
                                <MenuItem value={-1}>Descending</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Employees;
