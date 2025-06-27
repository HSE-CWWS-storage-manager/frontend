import type {User} from "../../domain/user.ts";
import {action, makeAutoObservable} from "mobx";
import AppStore from "./AppStore.ts";
import type {ITokenPayload, Token} from "../../domain/token.ts";

export default class AuthStore {
    token: Token | null = null;
    user: User | null = null;

    constructor(private store: AppStore) {
        makeAutoObservable(this)

        const localToken = localStorage.getItem("token");
        if (localToken) {
            this.load(localToken);
        }
    }

    @action load(token: Token) {
        const stringPayload = token.split(".")[1];
        const payload : ITokenPayload = JSON.parse(atob(stringPayload));

        if (payload.exp < Date.now() / 1000) {
            this.unload()
            return;
        }

        const user: User = {
            email: payload.email,
            roles: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
            id: payload.sub
        }

        this.setToken = token;
        this.user = user;
    }

    set setToken(token: Token | null) {
        this.token = token;

        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }

    @action unload() {
        this.setToken = null;
        this.user = null;
    }
}