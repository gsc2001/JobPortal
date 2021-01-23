import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import useSWR from 'swr';
import applicationAPI from '../../../api/applications';
import { pushAlert } from '../../../store/alerts';
import { getRatingfromMap } from '../../../utils';
import { Applicant, Application, RatingMap } from '../../../utils/types';

interface RecruiterApplicationsProps {}

type sortFieldType = 'applicantName' | 'createdAt' | 'applicantRating' | '';

const RecruiterApplications: React.FC<RecruiterApplicationsProps> = ({}) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const query = new URLSearchParams(location.search);
    const history = useHistory();
    const jobId = query.get('for');
    const { data, error, mutate } = useSWR(
        jobId ? `get-applications-job-${jobId}` : null,
        () => applicationAPI.get(jobId)
    );
    const [sort, setSort] = useState<{ field: sortFieldType; by: 1 | -1 | '' }>({
        field: '',
        by: ''
    });

    useEffect(() => {
        if (!jobId) {
            dispatch(
                pushAlert({
                    text: 'Please pass a valid job id in for query',
                    type: 'error'
                })
            );
            history.push('/app/dashboard');
        }
    }, []);

    if (!data) {
        return <div>Loading ..</div>;
    }

    if (error) {
        return <div>Error!!</div>;
    }

    const applications: Application[] = data.applications.map((appl: any) => ({
        ...appl,
        id: appl._id
    }));

    const columns: ColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return (params.getValue('applicant') as Partial<Applicant>).name;
            }
        },
        {
            field: 'skills',
            headerName: 'Skills',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return (params.getValue('applicant') as Partial<Applicant>).skills?.join(
                    ','
                );
            }
        },
        {
            field: 'createdAt',
            headerName: 'Date of Application',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return params.value?.toLocaleString();
            }
        },
        {
            field: 'education',
            headerName: 'Education',
            sortable: false,
            disableColumnMenu: true,
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return (params.getValue('applicant') as Partial<Applicant>).education
                    ?.map(
                        edu =>
                            `${edu.instituteName}(${edu.startYear}-${
                                edu.endYear ? edu.endYear : ''
                            })`
                    )
                    .join(',');
            }
        },
        {
            field: 'sop',
            headerName: 'SOP',
            sortable: false,
            disableColumnMenu: true,
            flex: 2
        },
        {
            field: 'rating',
            headerName: 'Applicants rating',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                const rating = getRatingfromMap(
                    (params.getValue('applicant') as Partial<Applicant>)
                        .ratingMap as RatingMap
                );
                if (rating == -1) {
                    return '-';
                } else return rating;
            }
        }
    ];

    const sortField = sort.field;
    if (sortField !== '' && sort.by !== '') {
        applications.sort((a, b) => {
            if (sortField === 'applicantName') {
                return (a.applicant.name as string).localeCompare(
                    b.applicant.name as string
                );
            } else if (sortField === 'applicantRating') {
                const aRating = getRatingfromMap(a.applicant.ratingMap as RatingMap);
                const bRating = getRatingfromMap(a.applicant.ratingMap as RatingMap);
                return aRating - bRating;
            } else {
                return a.createdAt.getTime() - b.createdAt.getTime();
            }
        });
        if (sort.by === -1) {
            applications.reverse();
        }
    }

    return (
        <div>
            <Grid container spacing={2} justify="space-between">
                <Grid item xs={12}>
                    <Typography variant="h3">All Jobs</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div style={{ height: 700, width: '100%' }}>
                                <DataGrid columns={columns} rows={applications} />
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
                                    <MenuItem value="createdAt">
                                        Date of application
                                    </MenuItem>
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
        </div>
    );
};

export default RecruiterApplications;
