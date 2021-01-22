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

interface EmployeesProps {}

const Employees: React.FC<EmployeesProps> = ({}) => {
    const userId = useTypedSelector(state => state.auth.user.id);
    const { data, error, mutate } = useSWR(`get-employee-${userId}`, () =>
        userAPI.getEmployees()
    );
    const dispatch = useDispatch();

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

    const employees = data.applications.map((appl: EmployeeApplication) => ({
        ...appl,
        id: appl._id
    }));

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h3"> My Employees </Typography>
                {/* {JSON.stringify(employees)} */}
            </Grid>
            <Grid item xs={12}>
                <div style={{ height: 700, width: '100%' }}>
                    <DataGrid columns={columns} rows={employees} />
                </div>
            </Grid>
        </Grid>
    );
};

export default Employees;
