import {
    ColDef,
    DataGrid,
    ValueFormatterParams,
    ValueGetterParams
} from '@material-ui/data-grid';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useSWR from 'swr';
import { useTypedSelector } from '../../../utils/hooks';
import applicationsAPI from '../../../api/applications';
import { Application, Job, RatingMap, User } from '../../../utils/types';
import RateCell from '../../../components/RateCell';
import { useDispatch } from 'react-redux';
import { pushAlert } from '../../../store/alerts';
import jobsAPI from '../../../api/jobs';

interface ApplicantApplicationsProps {}

const ApplicantApplications: React.FC<ApplicantApplicationsProps> = ({}) => {
    const userId = useTypedSelector(state => state.auth.user.id);
    const dispatch = useDispatch();

    const { data, error } = useSWR(`get-applications-${userId}`, () =>
        applicationsAPI.get()
    );

    if (!data) {
        return <div>Loading..</div>;
    }
    if (error) {
        return <div>Error !!</div>;
    }

    const applications: Application[] = data.applications.map((application: any) => ({
        ...application,
        id: application._id
    }));

    const onRate = (jobId: string) => async (rating: number | '') => {
        if (rating === '') return;
        try {
            const _res = await jobsAPI.rate(jobId, rating);
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
            field: 'jobName',
            headerName: 'Title',
            valueGetter: (params: ValueGetterParams) => {
                return (params.getValue('job') as Partial<Job>).name;
            },
            flex: 1,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: 'doj',
            headerName: 'Date of Joining',
            valueFormatter: (params: ValueFormatterParams) => {
                if (!params.value) {
                    return '-';
                }
                return (params.value as Date).toLocaleString();
            },
            flex: 1,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: 'jobSalary',
            headerName: 'Salary',
            valueGetter: (params: ValueGetterParams) => {
                return (params.getValue('job') as Partial<Job>).salary;
            },
            flex: 1,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: 'recName',
            headerName: 'Recruiter Name',
            valueGetter: (params: ValueGetterParams) => {
                return (params.getValue('job') as Partial<Job>).recruiter?.name;
            },
            flex: 1,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: 'status',
            headerName: 'Rate',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params: ValueFormatterParams) => {
                const job = params.getValue('job') as Job;
                return params.value === 'ACC' ? (
                    <RateCell
                        ratingMap={job.ratingMap}
                        onRate={onRate(params.getValue('id') as string)}
                    />
                ) : (
                    <strong>-</strong>
                );
            }
        }
    ];

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h3"> My Applications </Typography>
            </Grid>
            <Grid item xs={12}>
                <div style={{ height: 700, width: '100%' }}>
                    <DataGrid columns={columns} rows={applications} />
                </div>
            </Grid>
        </Grid>
    );
};

export default ApplicantApplications;
