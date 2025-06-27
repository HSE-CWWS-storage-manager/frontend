import type AppStore from "../store/AppStore.ts";
import type AppApi from "./AppApi.ts";
import type {Role, User} from "../../domain/user.ts";
import type {AxiosError, AxiosResponse} from "axios";

enum Operation {
    Add, Remove
}

export default class AdminApi {
    constructor(private api: AppApi, private store: AppStore) { }

    async loadPage(pageNumber: number) : Promise<void> {
        return this.api.client
            .get("/Account/GetUsers", { params: { Page: pageNumber } })
            .then((res) => {
                if (res.data.users) {
                    this.store.admin.appendPage(res.data.users);
                } else {
                    return Promise.reject(res);
                }
            })
            .catch((error: AxiosError) => {
                return Promise.reject(error);
            })
    }

    async setAdmin(userId: string): Promise<void> {
        return this.setRole(userId, Operation.Add, 'Admin')
            .then((res) => {
                this.store.admin.setById(userId, res.data)
            })
            .catch((error: AxiosError) => {
                return Promise.reject(error);
            })
    }

    async setOperator(userId: string): Promise<void> {
        return this.setRole(userId, Operation.Add, 'Operator')
            .then((res) => {
                this.store.admin.setById(userId, res.data)
            })
            .catch((error: AxiosError) => {
                return Promise.reject(error);
            })
    }

    async clearRoles(userId: string): Promise<void> {
        return this.setRole(userId, Operation.Remove, 'Admin')
            .then(() => {
                this.setRole(userId, Operation.Remove, 'Operator')
                    .then((res) => {
                        this.store.admin.setById(userId, res.data)
                    })
                    .catch((error: AxiosError) => {
                        return Promise.reject(error);
                    })
            })
            .catch((error: AxiosError) => {
                return Promise.reject(error);
            })
    }

    private async setRole(userId: string, operation: Operation, role: Role): Promise<AxiosResponse<User>> {
        const request = {
            userId: userId,
            operation: operation == Operation.Add ? 1 : 2,
            role: role,
        }

        return this.api.client.patch("/Account/ModifyRole", request)
    }
}