import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgess from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FormikTextField } from './FormikTextField';
import SelectInput from '@material-ui/core/Select/SelectInput';
import { Box } from '@material-ui/core';

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
                    onSubmit={async a => {
                        console.log(a);
                    }}
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
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && (
                                    <CircularProgess size={24} color="inherit" />
                                )}
                                Sign In
                            </Button>
                        </Form>
                    )}
                </Formik>
                <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                </Link>
            </div>
        </Container>
    );
};

export default Login;
