import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { FormikTextField } from '../../../components/FormikTextField';
import jobsAPI from '../../../api/jobs';
import { mutate } from 'swr';
import { useDispatch } from 'react-redux';
import { pushAlert } from '../../../store/alerts';
import LoadingButton from '../../../components/LoadingButton';

interface ApplyDialogProps {
    jobId: string;
}

const validationSchema = Yup.object().shape({
    sop: Yup.string()
        .required()
        .test('word-count', 'Number of words should be < 250', function (value) {
            if (!value) {
                return true;
            }
            if (value.split(' ').length > 250) {
                // no of words > 250
                return false;
            }
            return true;
        })
});

const ApplyDialog: React.FC<ApplyDialogProps> = ({ jobId }) => {
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();

    console.log(jobId);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onApply = async ({ sop }: { sop: string }) => {
        try {
            const _res = await jobsAPI.apply(jobId, sop);
            mutate('get-all-jobs');
            dispatch(pushAlert({ text: 'Applied Successfully', type: 'success' }));
            handleClose();
            return;
        } catch (err) {
            console.error();
            if (err.errors) {
                err.errors.forEach((er: { msg: string }) =>
                    dispatch(pushAlert({ text: er.msg, type: 'error' }))
                );
            }
            handleClose();
        }
    };

    return (
        <div>
            <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                <strong>Apply</strong>
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Apply </DialogTitle>
                <Formik
                    initialValues={{ sop: '' }}
                    onSubmit={onApply}
                    validationSchema={validationSchema}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <DialogContent>
                                <DialogContentText>
                                    Please add below sop of less than 250 words to apply
                                </DialogContentText>
                                <FormikTextField
                                    formikKey="sop"
                                    autoFocus
                                    margin="normal"
                                    label="SOP"
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                    rows={5}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                                <LoadingButton
                                    type="submit"
                                    color="primary"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    Apply
                                </LoadingButton>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    );
};

export default ApplyDialog;
