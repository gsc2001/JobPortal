import React, { useState } from 'react';
import {
    Container,
    Avatar,
    Typography,
    makeStyles,
    Theme,
    createStyles
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import PersonIcon from '@material-ui/icons/Person';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import ApplicantForm from '../../components/UserForms/ApplicantForm';
import coreAPI from '../../api/core';
import { useDispatch } from 'react-redux';
import { authSuccess } from '../../store/auth';
import RecruiterForm from '../../components/UserForms/RecruiterForm';

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
        formControl: {
            marginTop: 20,
            width: '100%'
        }
    })
);

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    type RegisterType = 'applicant' | 'recruiter';

    const [role, setRole] = useState<RegisterType>('applicant');

    return (
        <>
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <PersonIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">
                            Role
                        </InputLabel>
                        <Select
                            // labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            label="Role"
                            fullWidth
                            margin="dense"
                            value={role}
                            onChange={e => setRole(e.target.value as RegisterType)}
                        >
                            <MenuItem value="applicant">Applicant</MenuItem>
                            <MenuItem value="recruiter">Recruiter</MenuItem>
                        </Select>
                    </FormControl>
                    {role === 'applicant' ? (
                        <ApplicantForm
                            initialValues={{
                                name: '',
                                password: '',
                                password2: '',
                                email: '',
                                education: [
                                    {
                                        instituteName: '',
                                        startYear: '',
                                        endYear: ''
                                    }
                                ],
                                skills: [],
                                role: 'applicant',
                                avatarImage: ''
                            }}
                            onSubmit={async a => {
                                const _res = await coreAPI.register(a);
                                dispatch(authSuccess(_res));
                            }}
                            register={true}
                        />
                    ) : (
                        <RecruiterForm
                            initialValues={{
                                name: '',
                                password: '',
                                password2: '',
                                email: '',
                                avatarImage: '',
                                role: 'recruiter',
                                bio: '',
                                contactNumber: ''
                            }}
                            onSubmit={async a => {
                                const _res = await coreAPI.register(a);
                                dispatch(authSuccess(_res));
                            }}
                            register={true}
                        />
                    )}
                    <Link to="/login">Already have an account ? Sign In</Link>
                </div>
            </Container>
        </>
    );
};

export default Register;
