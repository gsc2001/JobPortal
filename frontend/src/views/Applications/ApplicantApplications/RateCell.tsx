import { MenuItem } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useTypedSelector } from '../../../utils/hooks';
import { RatingMap } from '../../../utils/types';
import jobsAPI from '../../../api/jobs';
import { useDispatch } from 'react-redux';
import { pushAlert } from '../../../store/alerts';

interface RateCellProps {
    ratingMap: RatingMap;
    jobId: string;
}

const RateCell: React.FC<RateCellProps> = ({ ratingMap, jobId }) => {
    const userId = useTypedSelector(state => state.auth.user.id);
    const [rating, setRating] = useState<number | ''>(ratingMap[userId] || '');

    const dispatch = useDispatch();

    const onRate = async () => {
        if (rating === '') return;
        try {
            const _res = await jobsAPI.rate(jobId, rating);
        } catch (err) {
            if (err.errors) {
                err.errors.forEach((er: { msg: string }) =>
                    dispatch(pushAlert({ text: er.msg, type: 'error' }))
                );
            }
        }
    };

    return (
        <Box flexDirection="row" style={{ width: '100%', padding: 2 }}>
            <FormControl variant="outlined" style={{ paddingRight: 2 }}>
                <Select
                    id="demo-simple-select-outlined"
                    fullWidth
                    margin="dense"
                    value={rating}
                    onChange={e => {
                        setRating(e.target.value as number | '');
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {[1, 2, 3, 4, 5].map(r => (
                        <MenuItem value={r} key={r}>
                            {r}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                color="secondary"
                disabled={rating === '' || rating === ratingMap[userId]}
                onClick={onRate}
            >
                Rate
            </Button>
        </Box>
    );
};

export default RateCell;
