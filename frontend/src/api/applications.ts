import api from './helper';

const applicationAPI = {
    async get() {
        return await api.get('/api/applications');
    }
};

export default applicationAPI;
