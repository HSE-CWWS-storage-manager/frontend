import type {User} from "../../domain/user.ts";
import type AppStore from "./AppStore.ts";
import {action, makeAutoObservable} from "mobx";

export default class AdminStore {
    users: User[] = [];
    private page: number = 1;

    constructor(private store: AppStore) {
        makeAutoObservable(this)
    }

    @action appendPage(page: User[]) {
        if (page.length === 0) {
            return;
        }

        this.users = this.users.concat(page);
        this.page += 1;
    }

    get getPage() {
        return this.page
    }

    @action setById(id: string, user: User) {
        const index = this.users.findIndex((user) => user.id === id)
        if (index > -1) {
            this.users[index] = user;
        }
    }
}