import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PersonIcon from '@material-ui/icons/Person';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';

import { useTypedSelector } from '../../utils/hooks';

const drawerWidth = 220;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            width: drawerWidth,
            flexShrink: 0
        },
        drawerPaper: {
            width: drawerWidth
        },
        drawerContainer: {
            overflow: 'auto'
        },
        avatar: {
            cursor: 'pointer',
            width: 64,
            height: 64
        }
    })
);

const SideDrawer: React.FC = () => {
    const classes = useStyles();
    const user = useTypedSelector(state => state.auth.user);

    if (!user) {
        return <div>Please Log in </div>;
    }

    const isApplicant = user.role === 'applicant';

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper
            }}
        >
            <Toolbar />
            <div className={classes.drawerContainer}>
                <Box alignItems="center" display="flex" flexDirection="column" p={2}>
                    <Avatar
                        className={classes.avatar}
                        component={RouterLink}
                        src={user.avatarImage}
                        to="/app/profile"
                    />
                    <Typography color="textPrimary" variant="h5">
                        {user.name}
                    </Typography>
                    <Typography variant="caption">{user.email}</Typography>
                </Box>
                <Divider />
                <List>
                    <ListItem button component={RouterLink} to="/app/dashboard">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button component={RouterLink} to="/app/profile">
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    {isApplicant ? (
                        <ListItem button component={RouterLink} to="/app/applications">
                            <ListItemIcon>
                                <FormatListBulletedIcon />
                            </ListItemIcon>
                            <ListItemText primary="My Applications" />
                        </ListItem>
                    ) : (
                        <ListItem button component={RouterLink} to="/app/employees">
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="My Employees" />
                        </ListItem>
                    )}
                </List>
            </div>
        </Drawer>
    );
};

export default SideDrawer;
