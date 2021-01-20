import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useTypedSelector } from '../../utils/hooks';
import { useDispatch } from 'react-redux';
import { authReset } from '../../store/auth';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            flexGrow: 1
        },
        title: {
            flexGrow: 1
        }
    })
);

export default function TopBar() {
    const classes = useStyles();
    const isLoggedIn = useTypedSelector(state => state.auth.isLoggedIn);
    const dispatch = useDispatch();
    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" noWrap className={classes.title}>
                    Job Portal
                </Typography>
                {isLoggedIn && (
                    <Tooltip title="Logout" arrow>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={() => dispatch(authReset())}
                        >
                            <ExitToAppIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        </AppBar>
    );
}
