import { Injectable } from '@nestjs/common';
import * as jwt from "jsonwebtoken";
import { secret } from "../config";

export interface Token {
    username: string;
    scope: string;
}

@Injectable()
export class JwtService {

    createRefreshToken(username) {
        const token: Token = {
            username: username,
            scope: "refresh"
        };
        return jwt.sign(token, secret);
    }

    createAccessToken(username, scope) {
        const token: Token = {
            username: username,
            scope: scope
        };
        return jwt.sign(token, secret);
    }

    verify(token): Token {
        const retval: any = jwt.verify(token, secret);
        if (typeof retval == "string") {
            return JSON.parse(retval);
        }
        return {
            username: retval.username,
            scope: retval.scope
        };
    }
}