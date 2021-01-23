import api from './helper';

const applicationAPI = {
    async get(jobId?: string | null) {
        const url = jobId ? `/api/applications?jobId=${jobId}` : '/api/applications';
        return await api.get(url);
    }
};

export default applicationAPI;
