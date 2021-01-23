import api from './helper';
import { ApplicationStatus } from '../utils/types';

const applicationAPI = {
    async get(jobId?: string | null) {
        const url = jobId ? `/api/applications?jobId=${jobId}` : '/api/applications';
        return await api.get(url);
    },
    async status_update(applicationId: string, status: ApplicationStatus) {
        return await api.put(`/api/applications/${applicationId}/status_update`, {
            body: { status }
        });
    }
};

export default applicationAPI;
