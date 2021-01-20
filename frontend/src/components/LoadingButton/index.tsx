import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgess from '@material-ui/core/CircularProgress';

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
    loading: boolean;
};

const LoadingButton: React.FC<LoadingButtonProps> = ({ loading, children, ...props }) => {
    return <Button {...props}>{loading ? 'loading' : children}</Button>;
};

export default LoadingButton;
