import { getEmitHelpers } from 'typescript';
import api from './helper';

const userAPI = {
    async uploadImage(file: any) {
        return await api.post('/api/user/upload_image', { body: { file } });
    },
    async me() {
        return await api.get('/api/user/me');
    },
    async getEmployees() {
        return await api.get('/api/user/employees');
    },
    async rate(userId: string, rating: number) {
        return await api.patch(`/api/user/rate/${userId}`, { body: { rating } });
    },
    async updateMe(userData: Object) {
        return await api.patch('/api/user/me', { body: userData });
    }
};

export default userAPI;
