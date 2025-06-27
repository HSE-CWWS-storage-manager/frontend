import axios from "axios";
import type AppStore from "../store/AppStore.ts";
import {type IReactionDisposer, reaction} from "mobx";
import type {Token} from "../../domain/token.ts";
import AuthApi from "./AuthApi.ts";
import AdminApi from "./AdminApi.ts";
import EquipmentApi from "./EquipmentApi.ts";
import StudentApi from "./StudentApi.ts";

export default class AppApi {
    client = axios.create({
        baseURL: '/api',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    auth: AuthApi;
    admin: AdminApi;
    equipment: EquipmentApi;
    student: StudentApi

    dispose: IReactionDisposer

    constructor(private store: AppStore) {
        this.auth = new AuthApi(this, store);
        this.admin = new AdminApi(this, store);
        this.equipment = new EquipmentApi(this, store);
        this.student = new StudentApi(this, store);

        this.updateToken(store.auth.token)

        this.dispose = reaction(
            () => store.auth.token,
            (token: Token | null) => {
                this.updateToken(token)
            }
        )
    }

    private updateToken(token: string | null) {
        if (token) {
            this.client.interceptors.request.use(
                config => {
                    config.headers["Authorization"] = `Bearer ${token}`
                    return config;
                },
                error => {
                    if (error.response && error.response.status === 401) {
                        this.store.auth.unload()
                    }
                    return Promise.reject(error);
                }
            )
        } else {
            this.client.interceptors.response.clear()
        }
    }
}