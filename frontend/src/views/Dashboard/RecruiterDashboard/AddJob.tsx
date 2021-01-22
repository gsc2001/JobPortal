import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import { Form, Formik } from 'formik';
import { FormikTextField } from '../../../components/FormikTextField';
import Grid from '@material-ui/core/Grid';
import FormikSelectField from '../../../components/FormikSelectField';
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import { dateTimeFormat, JobSchema } from './schemas';
import jobsAPI from '../../../api/jobs';
import { useDispatch } from 'react-redux';
import { pushAlert } from '../../../store/alerts';
import LoadingButton from '../../../components/LoadingButton';

interface AddJobProps {
    onAdd: () => void;
}

interface JobInput {
    name: string;
    maxApplications: number | '';
    maxPositions: number | '';
    applicationDeadline: string;
    requiredSkills: Array<string>;
    jobType: 'FT' | 'PT' | 'WFH';
    duration: number;
    salary: number | '';
}

const initialValues: JobInput = {
    name: '',
    maxApplications: '',
    maxPositions: '',
    applicationDeadline: moment().format(dateTimeFormat),
    requiredSkills: [],
    jobType: 'PT',
    duration: 0,
    salary: ''
};

const AddJob: React.FC<AddJobProps> = ({ onAdd }) => {
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSave = async (a: JobInput) => {
        const job = {
            ...a,
            applicationDeadline: moment(
                a.applicationDeadline,
                dateTimeFormat
            ).toISOString()
        };
        try {
            const _res = await jobsAPI.add(job);
            onAdd();
            console.log(_res);
            handleClose();
        } catch (err) {
            console.error(err);
            if (err.errors) {
                err.errors.forEach((er: { msg: string }) =>
                    dispatch(pushAlert({ text: er.msg, type: 'error' }))
                );
            }
        }
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
            >
                Add Job
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="add-job-title">
                <DialogTitle id="add-job-title">Create Job</DialogTitle>
                <Formik
                    onSubmit={onSave}
                    initialValues={initialValues}
                    validationSchema={JobSchema}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form>
                            <DialogContent>
                                <DialogContentText>Create a job</DialogContentText>
                                <Grid container spacing={2} justify="space-evenly">
                                    <Grid item xs={5}>
                                        <FormikTextField
                                            formikKey="name"
                                            variant="outlined"
                                            label="Title"
                                            fullWidth
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormikTextField
                                            formikKey="applicationDeadline"
                                            type="datetime-local"
                                            variant="outlined"
                                            fullWidth
                                            label="Deadline"
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormikTextField
                                            formikKey="maxApplications"
                                            variant="outlined"
                                            label="Max Applications"
                                            type="number"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormikTextField
                                            formikKey="maxPositions"
                                            variant="outlined"
                                            label="Max Positions"
                                            type="number"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormikTextField
                                            formikKey="salary"
                                            variant="outlined"
                                            label="Salary Per Month"
                                            type="number"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Autocomplete
                                            multiple
                                            id="tags-filled"
                                            value={values.requiredSkills}
                                            options={['JS', 'Python', 'C++', 'C']}
                                            freeSolo
                                            renderTags={(value: string[], getTagProps) =>
                                                value.map(
                                                    (option: string, index: number) => (
                                                        <Chip
                                                            variant="outlined"
                                                            label={option}
                                                            {...getTagProps({ index })}
                                                        />
                                                    )
                                                )
                                            }
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label="Required Skills"
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                            )}
                                            onChange={(e, value) => {
                                                setFieldValue('requiredSkills', value);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormikSelectField
                                            formikKey="duration"
                                            label="Duration"
                                            options={[0, 1, 2, 3, 4, 5, 6].map(i => ({
                                                value: '' + i,
                                                label: '' + i
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormikSelectField
                                            formikKey="jobType"
                                            label="Job Type"
                                            options={[
                                                { value: 'PT', label: 'Part-Time' },
                                                { value: 'FT', label: 'Full-Time' },
                                                { value: 'WFH', label: 'Work from Home' }
                                            ]}
                                        />
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                                <LoadingButton
                                    color="primary"
                                    type="submit"
                                    loading={isSubmitting}
                                >
                                    Save
                                </LoadingButton>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    );
};

export default AddJob;
