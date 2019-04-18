import { HttpService, Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import { AxiosResponse } from "axios";
import { strava_cid, strava_secret } from "../config";
import { StravaService } from "./strava.service";
import { StravaTokenResult } from "../dto";
import * as querystring from "querystring";
import { map } from "rxjs/operators";

const TOKEN_URL = "https://www.strava.com/oauth/token";


@Injectable()
export class StravaAccess implements NestMiddleware {
    constructor(private readonly httpService: HttpService,
                private readonly stravaService: StravaService) {}

    async grant(req, res, next) {
        if (req.query.code) {
            const principalId = req.query.principalId;
            await this.httpService.post(
                TOKEN_URL,
                {
                    client_id: strava_cid,
                    client_secret: strava_secret,
                    grant_type: "authorization_code",            
                    code: req.query.code    
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .toPromise()
            .then((results: AxiosResponse<StravaTokenResult>) => {
                this.stravaService.grantAccessTo(principalId, results.data);
            });
        }
        return next();
    }


    resolve(name: string): MiddlewareFunction {
        return (req, res, next) => {
            if (req.query.state
                && req.query.state.match("STRAVA")) {
                return this.grant(req, res, next);
            }
            return next()
        };
    }

}