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
    },
    async add(job: Object) {
        return await api.post('/api/jobs', { body: { ...job } });
    },
    async delete(jobId: string) {
        return await api.delete(`/api/jobs/${jobId}`);
    },
    async edit(jobId: string, jobUpdateData: Object) {
        return await api.put(`/api/jobs/${jobId}`, { body: { ...jobUpdateData } });
    }
};

export default jobsAPI;
