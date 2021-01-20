import React, { useState } from 'react';
import {
    Checkbox,
    createStyles,
    Divider,
    FormControlLabel,
    FormGroup,
    makeStyles,
    Theme,
    Typography
} from '@material-ui/core';
import useSWR from 'swr';
import { useTypedSelector } from '../../../utils/hooks';
import { ColDef, DataGrid, ValueFormatterParams } from '@material-ui/data-grid';
import Grid from '@material-ui/core/Grid';
import jobsAPI from '../../../api/jobs';
import TextField from '@material-ui/core/TextField';
import { Job } from '../../../utils/types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

interface ApplicantDashboardProps {}

const columns: ColDef[] = [
    {
        field: 'name',
        headerName: 'Title',
        width: 100,
        sortable: false,
        disableColumnMenu: true
    },
    {
        field: 'recruiterName',
        headerName: 'Recruiter Name',
        width: 140,
        sortable: false,
        disableColumnMenu: true
    },

    {
        field: 'rating',
        headerName: 'Rating',
        valueFormatter: (params: ValueFormatterParams) => {
            if (!params.value) {
                return '-';
            }
            return params.value;
        },
        width: 80,
        sortable: false,
        disableColumnMenu: true
    },
    { field: 'salary', headerName: 'Salary', sortable: false, disableColumnMenu: true },
    {
        field: 'duration',
        headerName: 'Duration',
        width: 90,
        sortable: false,
        disableColumnMenu: true
    },

    {
        field: 'applicationDeadline',
        headerName: 'Deadline',
        width: 170,
        valueFormatter: (params: ValueFormatterParams) => {
            if (!params.value) {
                return '-';
            }
            return new Date(params.value as string).toLocaleString();
        },
        sortable: false,
        disableColumnMenu: true
    }
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        main: {
            height: 500,
            width: '100%'
        }
    })
);

type durationType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | '';

const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({}) => {
    const { data, error, mutate } = useSWR('get-all-jobs', () => jobsAPI.get());
    const [{ FT, PT, WFH }, setType] = useState({ FT: true, PT: true, WFH: true });
    const [duration, setDuration] = useState<durationType>('');
    const [salaryLim, setSalaryLim] = useState({
        min: { value: '', error: '' },
        max: { value: '', error: '' }
    });
    const [search, setSearch] = useState('');

    if (!data) {
        return <div>Loading..</div>;
    }
    if (error) {
        return <div>Error!!</div>;
    }
    let jobs: Job[] = data.jobs.map((job: any) => ({ ...job, id: job._id }));
    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setType({ FT, PT, WFH, [event.target.name]: event.target.checked });
    };
    const handleSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const name = event.target.name;
        const numberRE = /^\d+$/;
        if (!numberRE.test(value)) {
            setSalaryLim({
                ...salaryLim,
                [name]: {
                    value: value,
                    error: 'Not a number'
                }
            });
            return;
        }
        const _min = salaryLim.min.value;
        if (_min && name === 'max') {
            if (+value < +_min) {
                setSalaryLim({
                    ...salaryLim,
                    [event.target.name]: {
                        value: value,
                        error: 'Should be greater than min'
                    }
                });
                return;
            }
        }

        setSalaryLim({ ...salaryLim, [name]: { value, error: '' } });
    };

    // Filters ..
    jobs = jobs.filter(job => {
        let f1 = true,
            f2 = true,
            f3 = true,
            f4 = true,
            f5 = true;

        if (search !== '') {
            f1 = job.name.toLowerCase().includes(search.toLowerCase());
        }
        const _min = salaryLim.min.value;
        const _max = salaryLim.max.value;
        if (_min !== '') f2 = job.salary > +_min;
        if (_max !== '') f3 = job.salary > +_max;
        f4 = false;
        const acceptedTypes = [];
        if (FT) acceptedTypes.push('FT');
        if (PT) acceptedTypes.push('PT');
        if (WFH) acceptedTypes.push('WFH');
        if (acceptedTypes.indexOf(job.jobType) !== -1) f4 = true;
        if (duration !== '') {
            f5 = job.duration < duration;
        }
        return f1 && f2 && f3 && f4 && f5;
    });

    return (
        <div>
            <Grid container spacing={2} justify="space-between">
                <Grid item xs={12}>
                    <Typography variant="h3">All Jobs</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Search Job"
                                fullWidth
                                variant="outlined"
                                margin="dense"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <div style={{ height: 500, width: '100%' }}>
                                <DataGrid columns={columns} rows={jobs} />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4">Filter</Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Job Type</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={FT}
                                            name="FT"
                                            onChange={handleTypeChange}
                                        />
                                    }
                                    label="Full Time"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={PT}
                                            name="PT"
                                            onChange={handleTypeChange}
                                        />
                                    }
                                    label="Part Time"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={WFH}
                                            name="WFH"
                                            onChange={handleTypeChange}
                                        />
                                    }
                                    label="Work From Home"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Salary</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Min"
                                fullWidth
                                variant="outlined"
                                margin="dense"
                                value={salaryLim.min.value}
                                name="min"
                                onChange={handleSalaryChange}
                                helperText={salaryLim.min.error}
                                error={!!salaryLim.min.error}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Max"
                                fullWidth
                                variant="outlined"
                                margin="dense"
                                value={salaryLim.max.value}
                                name="max"
                                onChange={handleSalaryChange}
                                helperText={salaryLim.max.error}
                                error={!!salaryLim.max.error}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Duration Less than</Typography>
                            <FormControl variant="outlined" style={{ width: '100%' }}>
                                <Select
                                    id="demo-simple-select-outlined"
                                    fullWidth
                                    margin="dense"
                                    value={duration}
                                    onChange={e =>
                                        setDuration(e.target.value as durationType)
                                    }
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default ApplicantDashboard;
