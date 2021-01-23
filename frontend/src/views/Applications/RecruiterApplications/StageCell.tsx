import { Button, Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import applicationAPI from '../../../api/applications';
import { pushAlert } from '../../../store/alerts';
import { ApplicationStatus } from '../../../utils/types';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        acceptBtn: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.getContrastText(theme.palette.success.main)
        }
    })
);

interface StageCellProps {
    currentStage: ApplicationStatus;
    onChangeDone: () => void;
    applicationId: string;
}

const StageCell: React.FC<StageCellProps> = ({
    currentStage,
    onChangeDone,
    applicationId
}) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();

    const changeStatus = async (newStatus: ApplicationStatus) => {
        setLoading(true);
        try {
            const _res = await applicationAPI.status_update(applicationId, newStatus);
            onChangeDone();
        } catch (err) {
            console.error(err);
            if (err.errors) {
                err.errors.forEach((er: { msg: string }) =>
                    dispatch(pushAlert({ text: er.msg, type: 'error' }))
                );
            }
        }
        setLoading(false);
    };

    if (loading) {
        return <Button disabled>Loading.</Button>;
    }

    if (currentStage === 'ACC') {
        return (
            <Typography variant="button" color="primary">
                <strong>Accepted</strong>
            </Typography>
        );
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                {currentStage === 'STB' ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => changeStatus('SHL')}
                    >
                        ShortList
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        className={classes.acceptBtn}
                        onClick={() => changeStatus('ACC')}
                    >
                        Accept
                    </Button>
                )}
            </Grid>
            <Grid item xs={6}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => changeStatus('REJ')}
                >
                    Reject
                </Button>
            </Grid>
        </Grid>
    );
};

export default StageCell;
