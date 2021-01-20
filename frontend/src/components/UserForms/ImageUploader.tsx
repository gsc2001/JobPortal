import { Box, Button, Container } from '@material-ui/core';
import React, { useState } from 'react';

import userAPI from '../../api/user';
import readFile from '../../utils/readFile';
import LoadingButton from '../LoadingButton';

interface ImageUploaderProps {
    onUploadDone: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadDone }) => {
    const [file, setFile] = useState<File | undefined>();
    const [loading, setLoading] = useState(false);

    const onUpload = async () => {
        if (!file) return;
        setLoading(true);
        const imgb64 = await readFile(file);
        const image = await userAPI.uploadImage(imgb64);
        console.log(image);
        onUploadDone(image.url);
        setLoading(false);
    };

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <input
                type="file"
                accept="image/*"
                onChange={e => {
                    if (!e.target.files) return;
                    setFile(e.target.files[0]);
                }}
            />
            <LoadingButton
                color="secondary"
                variant="contained"
                loading={loading}
                onClick={onUpload}
                disabled={loading}
            >
                Upload
            </LoadingButton>
        </Box>
    );
};

export default ImageUploader;
