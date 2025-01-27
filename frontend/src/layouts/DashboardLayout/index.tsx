import React from 'react';
import { createStyles, makeStyles, Theme, Toolbar } from '@material-ui/core';
import { Switch } from 'react-router-dom';
import SideDrawer from '../../components/SideDrawer';
import TopBar from '../../components/TopBar';
import Alerts from '../../components/Alerts';

interface DashboardLayoutProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex'
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3)
        }
    })
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const classes = useStyles();
    return (
        <>
            <TopBar />
            <Toolbar />
            <div className={classes.root}>
                <SideDrawer />
                <main className={classes.content}>{children}</main>
                <Alerts />
            </div>
        </>
    );
};

export default DashboardLayout;
