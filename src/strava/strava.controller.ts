import { Get, Controller, HttpService, Res, Query } from '@nestjs/common';
import { StravaService } from './strava.service';
import { strava_cid, strava_secret } from "../config/";
import * as querystring from "querystring";

const REDIRECT_URI = process.env.STRAVA_REDIRECT_URI || "http://127.0.0.1:3000/strava/register";

@Controller('strava')
export class StravaController {
    constructor(private readonly stravaService: StravaService,
                private readonly httpService: HttpService) {}

    @Get("/register")
    register(): string {
        return "Access granted";
    }

    @Get("/request_access")
    getRequestAccess(@Query() query, @Res() response): string {
        if (query.error && query.error == "access_denied") {
            return response.send(401);
        }
        
        const qs = querystring.stringify({
            client_id: strava_cid,
            redirect_uri: `${REDIRECT_URI}?principalId=${query.principalId}`,
            response_type: "code",            
            scope: "read_all,activity:read_all,profile:read_all",
            state: "STRAVA"
        });
        return response.redirect(`https://www.strava.com/oauth/authorize?${qs}`);
    }
}
