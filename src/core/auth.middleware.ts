import * as crypto from "crypto";
import { HttpService, Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import { Observable } from 'rxjs';
import { request as rp } from 'request-promise';
import { secret } from "../config";
import { sign, verify } from "jsonwebtoken";
import * as Steem from "steem";
import { JwtService } from "./jwt.service";


const SC2_HOST = "steemconnect.com";
const SC2_CLIENT_ID = "sylveon";
const SC2_CLIENT_SECRET = process.env.SC2_CLIENT_SECRET;
const SC2_REDIRECT_URI = "http%3A%2F%2Flocalhost%3A3000%2F";

interface Credentials {
    username: string;
    wif: string;
}

@Injectable()
export class OAuth2 implements NestMiddleware {
    constructor(private readonly httpService: HttpService,
        private readonly jwtService: JwtService) {}

    authorizationFrom(auth) {
        if (auth) {
            return auth.replace(/^(Bearer|Basic)\s/, '').trim()
        }
        return undefined;
    }

    tokenFrom(req) {
        return req.query.access_token
          || req.body.access_token
          || req.query.code
          || req.body.code
          || req.query.refresh_token
          || req.body.refresh_token
          || this.authorizationFrom(req.get('authorization'));
    }

    credentialsFrom(token): Credentials {
        if (token.indexOf(":") > -1) {
            const cred_tuple = token.split(":");
            return { username: cred_tuple[0], wif: cred_tuple[1] }
        }
        return undefined
    }

    authorize(req, res, next) {
        const token = this.tokenFrom(req);
        try {
            verify(token, secret);
            /* eslint-disable no-param-reassign */
            req.token = token;
            req.type = "jwt";

            // Able to decode the token means it's an app token            
            return next();
        }
        catch (e) {
          // squash exception
        }

        // This means a steem key is being used in the authorization header
        // the format is something standard like username:wif

        const credentials = this.credentialsFrom(Buffer.from(token, "base64").toString());
        // check for wif
        return next();
    }

    resolve(name: string): MiddlewareFunction {
        return (req, res, next) => {
            return this.authorize(req, res, next);
        };
    }

}