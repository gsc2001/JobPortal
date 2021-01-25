import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ColDef, DataGrid, ValueFormatterParams } from '@material-ui/data-grid';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import { Divider, IconButton } from '@material-ui/core';
import useSWR from 'swr';
import { useTypedSelector } from '../../../utils/hooks';
import jobsAPI from '../../../api/jobs';
import { Job } from '../../../utils/types';
import AddJob from './AddJob';
import { useDispatch } from 'react-redux';
import { pushAlert } from '../../../store/alerts';
import EditJob from './EditJob';
import { dateTimeFormat } from './schemas';
import { useHistory } from 'react-router-dom';

interface RecruiterDashboardProps {}

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({}) => {
    const userId = useTypedSelector(state => state.auth.user.id);
    const { data, error, mutate } = useSWR(`get-jobs-${userId}`, () => jobsAPI.get());
    const dispatch = useDispatch();
    const history = useHistory();

    if (!data) {
        return <div>Loading..</div>;
    }
    if (error) {
        return <div>Error</div>;
    }

    // TODO: Not working
    const onDelete = async (jobId: string) => {
        console.log(jobId);
        if (window.confirm('Are you sure you want to delete?')) {
            const index = data.jobs.findIndex((job: Job) => {
                return job._id === jobId;
            });
            if (index === -1) {
                return;
            }
            try {
                const _res = await jobsAPI.delete(jobId);
                console.log(_res);
                mutate({
                    jobs: [...data.jobs.slice(0, index), ...data.jobs.slice(index + 1)]
                });
                dispatch(pushAlert({ text: 'Deleted Successfully!', type: 'success' }));
            } catch (err) {
                console.error(err);
                if (err.errors) {
                    err.errors.forEach((er: { msg: string }) =>
                        dispatch(pushAlert({ text: er.msg, type: 'error' }))
                    );
                }
            }
        }
    };

    const columns: ColDef[] = [
        {
            field: 'name',
            headerName: 'Title',
            sortable: false,
            disableColumnMenu: true,
            flex: 2
        },
        {
            field: 'createdAt',
            headerName: 'Date of Posting',
            sortable: false,
            disableColumnMenu: true,
            flex: 2
        },
        {
            field: 'nApplicants',
            headerName: 'Number of Applicants',
            sortable: false,
            disableColumnMenu: true,
            flex: 1
        },
        {
            field: 'rPositions',
            headerName: 'Remaining Positions',
            sortable: false,
            disableColumnMenu: true,
            flex: 1
        },
        {
            field: 'edit,delete',
            headerName: 'Actions',
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params: ValueFormatterParams) => {
                return (
                    <Box display="flex" flexDirection="row">
                        <EditJob
                            onEdit={mutate}
                            jobId={params.getValue('id') as string}
                            initialValues={{
                                maxApplications: params.getValue(
                                    'maxApplications'
                                ) as number,
                                maxPositions: params.getValue('maxPositions') as number,
                                applicationDeadline: moment(
                                    params.getValue('applicationDeadline') as string
                                ).format(dateTimeFormat)
                            }}
                        />
                        <IconButton
                            color="secondary"
                            onClick={() => onDelete(params.getValue('id') as string)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                );
            }
        }
    ];

    const jobs: Job[] = data.jobs.map((job: Job) => ({ ...job, id: job._id }));

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Box flexDirection="row" display="flex" alignItems="baseline">
                    <Typography variant="h3" style={{ flexGrow: 1 }}>
                        Job Listings
                    </Typography>
                    <AddJob onAdd={() => mutate()} />
                </Box>
            </Grid>
            <Grid item xs={12}>
                <div style={{ height: 700, width: '100%' }}>
                    <DataGrid
                        columns={columns}
                        rows={jobs}
                        onCellClick={a => {
                            if (a.field !== 'edit,delete') {
                                history.push(`/app/applications?for=${a.getValue('id')}`);
                            }
                        }}
                    />
                </div>
            </Grid>
        </Grid>
    );
};

export default RecruiterDashboard;
