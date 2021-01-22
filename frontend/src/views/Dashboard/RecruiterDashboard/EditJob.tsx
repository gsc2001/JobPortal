import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import { Form, Formik } from 'formik';
import { FormikTextField } from '../../../components/FormikTextField';
import LoadingButton from '../../../components/LoadingButton';
import { EditJobSchema } from './schemas';
import jobsAPI from '../../../api/jobs';
import { useDispatch } from 'react-redux';
import { pushAlert } from '../../../store/alerts';
import IconButton from '@material-ui/core/IconButton';

interface EditFormValues {
    maxPositions: number;
    maxApplications: number;
    applicationDeadline: string;
}

interface EditJobProps {
    jobId: string;
    initialValues: EditFormValues;
    onEdit: () => void;
}

const EditJob: React.FC<EditJobProps> = ({ jobId, initialValues, onEdit }) => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const onSave = async (a: EditFormValues) => {
        try {
            const _res = await jobsAPI.edit(jobId, a);
            console.log(_res);
            onEdit();
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
            <IconButton color="primary" onClick={handleOpen}>
                <EditIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose} aria-labelledby="edit-job-dialog">
                <DialogTitle id="edit-job-dialog">Edit a job</DialogTitle>
                <Formik
                    onSubmit={onSave}
                    initialValues={initialValues}
                    validationSchema={EditJobSchema}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <DialogContent>
                                <Grid container spacing={2} justify="space-evenly">
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

export default EditJob;
