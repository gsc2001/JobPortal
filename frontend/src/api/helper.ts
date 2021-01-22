import axios, { AxiosResponse } from 'axios';

type Payload = {
    body?: Object;
    query?: Object;
};

const getConfig = (payload: Payload): Object => {
    if (payload.body) {
        return {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } else return {};
};

const apiHelpers = {
    get(url: string, payload: Payload = {}) {
        if (payload.query)
            return APICreatingUtility(
                axios.get(url, {
                    params: {
                        source_content_type: 'application/json',
                        source: JSON.stringify(payload.query)
                    }
                })
            );
        return APICreatingUtility(axios.get(url));
    },
    post(url: string, payload: Payload = {}) {
        return APICreatingUtility(axios.post(url, payload.body, getConfig(payload)));
    },
    put(url: string, payload: Payload = {}) {
        return APICreatingUtility(axios.put(url, payload.body, getConfig(payload)));
    },
    patch(url: string, payload: Payload = {}) {
        return APICreatingUtility(axios.patch(url, payload.body, getConfig(payload)));
    },
    delete(url: string) {
        return APICreatingUtility(axios.delete(url));
    }
};

export default apiHelpers;

export const APICreatingUtility = async (promise: Promise<AxiosResponse<any>>) => {
    try {
        const _res = await promise;
        return _res.data;
    } catch (err) {
        throw err.response.data;
    }
};
