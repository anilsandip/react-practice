window.axios = require('axios');

window.axios.defaults.baseURL = process.env.MIX_APP_URL;

export default class AxiosClass {
    async get(url, body) {
        return this.responseHandler(axios.get(url, body));
    }
    post(url, body) {
        return this.responseHandler(
            axios.post(url, body)
        );
    }
    put(url, body ) {
        return this.responseHandler(axios.put(url, body));
    }
    delete(url) {
        return this.responseHandler(axios.delete(url));
    }
    async responseHandler(responsePromise) {
        try {
            return await responsePromise;
        } catch (error) {
            console.log("----error----");
            throw error;
        }
    }
}
export const API = new AxiosClass();
