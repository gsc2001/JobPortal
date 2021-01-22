import React, { useState } from 'react';
import { useTypedSelector } from '../../utils/hooks';
import ApplicantProfile from './ApplicantProfile';
import RecruiterProfile from './RecruiterProfile';
import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

interface ProfileProps {}

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
            width: theme.spacing(15),
            height: theme.spacing(15)
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

const Profile: React.FC<ProfileProps> = ({}) => {
    const user = useTypedSelector(state => state.auth.user);
    const classes = useStyles();
    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar} src={user.avatarImage} />
                <Typography component="h1" variant="h4">
                    {user.name}
                </Typography>
                <Typography variant="subtitle1">{user.email}</Typography>
            </div>
            {user.role === 'applicant' ? <ApplicantProfile /> : <RecruiterProfile />}
        </Container>
    );
};

export default Profile;
