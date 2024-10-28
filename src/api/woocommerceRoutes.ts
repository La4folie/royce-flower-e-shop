import axios from 'axios';

const USERNAME = 'key';
const PASSWORD = 'key';

//This because of telegram caching. Our server don't have headers we need.
const getFuckCache = () => {
    const currentDate = new Date();
    const dateTimeString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}T${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;
    return dateTimeString;
};

export const api = axios.create({
    baseURL: 'https://www.faynlab.com/wp-json/wc/v3/',
    auth: {
        username: USERNAME,
        password: PASSWORD,
    },
});
export const halidKashmiri = axios.create({
    baseURL: 'https://www.faynlab.com/wp-json/custom-api/v1/',
});

export const fetchHalidKashmiri = <Response>(
    route: string,
    params?: Record<string, string>
) => {
    return halidKashmiri
        .get<Response>(route, {
            params: { ...params, fuckYouCache: getFuckCache() },
        })
        .then((res) => res.data);
};

export const fetchData = <Response>(
    route: string,
    params?: Record<string, string>
) =>
    api
        .get<Response>(route, {
            params: { ...params, fuckYouCache: getFuckCache() },
        })
        .then((res) => res.data);
