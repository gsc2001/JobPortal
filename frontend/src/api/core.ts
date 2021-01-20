import api from './helper';

const coreAPI = {
    async login(userData: Object) {
        return await api.post('/api/core/login', { body: userData });
    },
    async register(userData: Object) {
        return await api.post('/api/core/register', { body: userData });
    }
};

export default coreAPI;
