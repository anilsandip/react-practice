import axios from "axios";

axios.defaults.baseURL = process.env.MIX_APP_URL;

export default class AxiosClass {
    async get(url) {
        if (window.sessionToken === undefined) {
            await axios.get('/authenticate/token');
        }
        const headers = {
            'Authorization': `Bearer ${window.sessionToken}`,
        };
        return this.responseHandler(axios.get(url,{headers: headers}));
    }

    post(url, body) {
        const headers = {
            'Authorization': `Bearer ${window.sessionToken}`,
        };
        return this.responseHandler(
            axios.post(url, body , {headers: headers})
        );
    }

    put(url, body ) {
        const headers = {
            'Authorization': `Bearer ${window.sessionToken}`,
        };
        return this.responseHandler(axios.put(url, body, {headers: headers}));
    }

    delete(url) {
        const headers = {
            'Authorization': `Bearer ${window.sessionToken}`,
        };
        return this.responseHandler(axios.delete(url,{headers: headers}));
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
