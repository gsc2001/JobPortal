import { getEmitHelpers } from 'typescript';
import api from './helper';

const userAPI = {
    async uploadImage(file: any) {
        return await api.post('/api/user/upload_image', { body: { file } });
    },
    async me() {
        return await api.get('/api/user/me');
    }
};

export default userAPI;
