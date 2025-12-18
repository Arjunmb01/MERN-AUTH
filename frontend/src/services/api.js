import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const setupInterceptors = (store) => {
    api.interceptors.request.use(
        (config) => {
            const token = store.getState().auth.accessToken;
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue = [];
    };

    api.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const rs = await axios.get(`${API_URL}/auth/refresh`, { withCredentials: true });
                    const { accessToken } = rs.data;
                    window.dispatchEvent(new CustomEvent('tokenRefreshed', { detail: accessToken }));

                    api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                    originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;

                    processQueue(null, accessToken);
                    return api(originalRequest);
                } catch (_error) {
                    processQueue(_error, null);
                    window.dispatchEvent(new Event('forceLogout'));
                    return Promise.reject(_error);
                } finally {
                    isRefreshing = false;
                }
            }
            return Promise.reject(error);
        }
    );
};

export default api;
