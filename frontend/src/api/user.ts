import api from './helper';

const userAPI = {
    async uploadImage(file: any) {
        return await api.post('/api/user/upload_image', { body: { file } });
    }
};

export default userAPI;
