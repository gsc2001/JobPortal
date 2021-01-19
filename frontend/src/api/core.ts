import api, { APICreatingUtility } from './helper';

export default {
    async login(userData: Object) {
        return await api.post('/api/core/login', { body: userData });
    },
    async register(userData: Object) {
        return await api.post('/api/core/register', { body: userData });
    }
};
