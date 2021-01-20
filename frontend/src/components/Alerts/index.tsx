import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { useTypedSelector } from '../../utils/hooks';
import zIndex from '@material-ui/core/styles/zIndex';

interface AlertsProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        alerts: {
            position: 'fixed',
            width: '100%',
            padding: theme.spacing(3),
            bottom: 0,
            zIndex: theme.zIndex.drawer + 1
        }
    })
);

const Alerts: React.FC<AlertsProps> = ({}) => {
    const classes = useStyles();
    const alerts = useTypedSelector(state => state.alerts);
    if (!alerts.length) {
        return <></>;
    }
    return (
        <div className={classes.alerts}>
            {alerts.map(alert => (
                <Alert key={alert.id} severity={alert.type}>
                    {alert.text}
                </Alert>
            ))}
        </div>
    );
};

export default Alerts;
