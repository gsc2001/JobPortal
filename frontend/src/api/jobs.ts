import { pink } from '@material-ui/core/colors';
import RateCell from '../views/Applications/ApplicantApplications/RateCell';
import api from './helper';

const jobsAPI = {
    async get() {
        console.log('jobs called');
        return await api.get('/api/jobs');
    },
    async apply(jobId: string, sop: string) {
        return await api.post(`/api/jobs/${jobId}/apply`, { body: { sop } });
    },
    async rate(jobId: string, rating: number) {
        return await api.post(`/api/jobs/${jobId}/rate`, { body: { rating } });
    }
};

export default jobsAPI;
