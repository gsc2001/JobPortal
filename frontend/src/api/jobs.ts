import { pink } from '@material-ui/core/colors';
import api from './helper';

const jobsAPI = {
    async get() {
        console.log('jobs called');
        return await api.get('/api/jobs');
    },
    async apply(jobId: string, sop: string) {
        return await api.post(`/api/jobs/${jobId}/apply`, { body: { sop } });
    }
};

export default jobsAPI;
