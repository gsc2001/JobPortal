import { Button } from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';
import readFile from '../utils/readFile';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = ({}) => {
    const [file, setFile] = useState<File | undefined>();

    const upload = async () => {
        if (!file) return;
        try {
            const imgb64 = await readFile(file);
            const image = await axios.post('/api/user/upload_image', { file: imgb64 });
            console.log(image);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <input
                type="file"
                accept="image/*"
                onChange={e => {
                    if (!e.target.files) return;
                    setFile(e.target.files[0]);
                }}
            ></input>
            <Button onClick={upload} disabled={!file}>
                Upload!
            </Button>
        </div>
    );
};

export default Dashboard;
