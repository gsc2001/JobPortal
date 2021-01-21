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
import RateCell from './RateCell';

interface ApplicantApplicationsProps {}

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
                <RateCell ratingMap={job.ratingMap} jobId={job._id} />
            ) : (
                <strong>-</strong>
            );
        }
    }
];

const ApplicantApplications: React.FC<ApplicantApplicationsProps> = ({}) => {
    const userId = useTypedSelector(state => state.auth.user.id);

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
