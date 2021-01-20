import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgess from '@material-ui/core/CircularProgress';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Field, Form, Formik } from 'formik';

import { FormikTextField } from '../../components/FormikTextField';
import coreAPI from '../../api/core';
import { useDispatch } from 'react-redux';
import { authReset, authSuccess } from '../../store/auth';
import { pushAlert } from '../../store/alerts';
import { LoginSchema } from './schemas';
import LoadingButton from '../../components/LoadingButton';

interface LoginProps {}

interface LoginFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1)
        },
        submit: {
            margin: theme.spacing(3, 0, 2)
        }
    })
);

const Login: React.FC<LoginProps> = ({}) => {
    const classes = useStyles();
    const initialValues: LoginFormValues = { email: '', password: '', rememberMe: false };
    const dispatch = useDispatch();

    const login = async (userData: LoginFormValues) => {
        try {
            const _res = await coreAPI.login({
                email: userData.email,
                password: userData.password
            });
            console.log(_res);
            if (userData.rememberMe) {
                localStorage.setItem('GCS_JOBP', JSON.stringify(_res));
            }
            dispatch(authSuccess(_res));
        } catch (err) {
            console.log(err);
            dispatch(authReset());
            if (err.errors) {
                err.errors.forEach((e: { msg: string }) =>
                    dispatch(pushAlert({ text: e.msg, type: 'error' }))
                );
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Formik
                    initialValues={initialValues}
                    onSubmit={login}
                    validationSchema={LoginSchema}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <FormikTextField
                                formikKey="email"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                                autoFocus
                            />
                            <FormikTextField
                                formikKey="password"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                            />
                            <label>
                                <Field type="checkbox" name="rememberMe" />
                                Remember me
                            </label>
                            <LoadingButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={isSubmitting}
                                loading={isSubmitting}
                            >
                                Sign In
                            </LoadingButton>
                        </Form>
                    )}
                </Formik>
                <Link to="/register">{"Don't have an account? Sign Up"}</Link>
            </div>
        </Container>
    );
};

export default Login;
