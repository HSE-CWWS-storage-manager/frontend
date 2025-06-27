import type AppStore from "../store/AppStore.ts";
import type AppApi from "./AppApi.ts";
import type {AxiosError} from "axios";

export default class AuthApi {
    constructor(private api: AppApi, private store: AppStore) { }

    async login(email: string, password: string): Promise<void> {
        return this.api.client
            .post("/Account/Login", {email, password})
            .then((res) => {
                if (res && res.data && res.data.accessToken) {
                    this.store.auth.load(res.data.accessToken);
                } else {
                    return Promise.reject(res);
                }
            })
            .catch((error: AxiosError) => {
                return Promise.reject(error);
            })
    }

    async register(email: string, password: string, confirmPassword: string): Promise<void> {
        return this.api.client
            .post("/Account/Register", {email, password, confirmPassword})
            .then(() => {
                return this.login(email, password);
            })
            .then(() => {})
            .catch((error: AxiosError) => {
                return Promise.reject(error);
            })
    }

    async logout(): Promise<void> {
        this.store.auth.unload()

        return Promise.resolve()
    }
}