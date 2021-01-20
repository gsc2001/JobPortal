import api from './helper';

const jobsAPI = {
    async get() {
        return await api.get('/api/jobs');
    }
};

export default jobsAPI;
