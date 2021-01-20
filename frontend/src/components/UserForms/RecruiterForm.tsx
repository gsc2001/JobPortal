import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import { Formik, Form } from 'formik';

import { FormikTextField } from '../FormikTextField';
import ImageUploader from './ImageUploader';
import { RegisterRecruiterSchema } from './schemas';
import { randomNumber } from '../../utils';
import LoadingButton from '../LoadingButton';
import { useDispatch } from 'react-redux';
import { authReset } from '../../store/auth';
import { pushAlert } from '../../store/alerts';

export interface Recruiter {
    name: string;
    email: string;
    avatarImage: string;
    role: 'recruiter';
    bio: string;
    contactNumber: string;
}

interface RegisterRecruiter extends Recruiter {
    password: string;
    password2: string;
}

interface RecruiterFormProps {
    register: boolean;
    initialValues: RegisterRecruiter | Recruiter;
    onSubmit: (a: RegisterRecruiter | Recruiter) => Promise<any>;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        submit: {
            margin: theme.spacing(3, 0, 2)
        }
    })
);
const colors = ['9c32ff', 'e000e0', '1447f0', '1fbe27', '02b3b3', '7961ff'];

const RecruiterForm: React.FC<RecruiterFormProps> = ({
    register,
    initialValues,
    onSubmit
}) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async a => {
                if (!a.avatarImage || a.avatarImage === '') {
                    a.avatarImage = `https://via.placeholder.com/280x200.png/${
                        colors[randomNumber(6)]
                    }/ffffff?text=${a.name.toUpperCase()[0]}`;
                }
                try {
                    await onSubmit(a);
                    return;
                } catch (err) {
                    console.error(err);
                    dispatch(authReset());
                    if (err.errors) {
                        err.errors.forEach((e: { msg: string }) =>
                            dispatch(pushAlert({ text: e.msg, type: 'error' }))
                        );
                    }
                }
                return;
            }}
            validationSchema={register ? RegisterRecruiterSchema : RecruiterForm}
        >
            {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                    <Box paddingY={1}>
                        <FormikTextField
                            formikKey="name"
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            label="Name"
                            autoFocus
                        />
                        <FormikTextField
                            formikKey="email"
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            label="Email Address"
                            autoComplete="email"
                        />
                        {register && (
                            <>
                                <FormikTextField
                                    formikKey="password"
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                />
                                <FormikTextField
                                    formikKey="password2"
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    label="Confirm Password"
                                    type="password"
                                    autoComplete="current-password"
                                />
                            </>
                        )}
                        <FormikTextField
                            formikKey="contactNumber"
                            label="Contact Number"
                            fullWidth
                            margin="dense"
                            variant="outlined"
                        />
                    </Box>
                    <Divider />
                    <Box paddingY={1}>
                        <Typography variant="h6"> Profile Picture </Typography>
                        <ImageUploader
                            onUploadDone={url => setFieldValue('avatarImage', url, false)}
                        />
                    </Box>
                    <Divider />
                    <Box paddingY={1}>
                        <Typography variant="h6">Bio</Typography>
                        <FormikTextField
                            formikKey="bio"
                            multiline
                            label="Bio"
                            fullWidth
                            margin="dense"
                            variant="outlined"
                        />
                    </Box>

                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isSubmitting}
                        loading={isSubmitting}
                    >
                        {register ? 'Register' : 'Save'}
                    </LoadingButton>
                </Form>
            )}
        </Formik>
    );
};

export default RecruiterForm;
