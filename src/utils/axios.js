/**
 * axios setup to use mock service
 */

import axios from 'axios';

// Dispatch an action to update the access token in the Redux store

const axiosServices = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://elogistics.coderootz.com/api/',
    withCredentials: true
});

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.headers['x-server-errortype'] === 'AccessTokenExpired') {
            const accessToken = await axiosServices.get('/auth');
            originalRequest.retry = true;
            originalRequest.headers.Authorization = `Bearer ${accessToken.data.data.accessToken}`;
            axiosServices.defaults.headers.common.Authorization = `Bearer ${accessToken.data.data.accessToken}`;
            localStorage.setItem('accessToken', accessToken.data.data.accessToken);
            return axiosServices(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default axiosServices;
