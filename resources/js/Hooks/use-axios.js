import axios from 'axios';
const axiosClient = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});
export const useAxios = () => axiosClient;
