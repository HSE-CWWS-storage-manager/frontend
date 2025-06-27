import type {Role} from "./user.ts";

type Token = string;

interface ITokenPayload {
    sub: string;
    email: string;
    jti: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": Role[];
    exp: number;
    iss: string;
    aud: string;
}

export type { ITokenPayload, Token };