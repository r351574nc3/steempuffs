import { Get, Controller, Headers, HttpService, Post, Query, Req, Res } from '@nestjs/common';
import { GithubService } from './github.service';
import { strava_cid, strava_secret } from "../config";
import * as querystring from "querystring";
import { setupMaster } from 'cluster';
import { identity } from 'rxjs';


@Controller('github')
export class GithubController {
    constructor(private readonly githubService: GithubService,
                private readonly httpService: HttpService) {}

    @Get("setup")
    setup(@Query("installation_id") id, @Query("setup_action") action) {
        const jwt_token = this.githubService.generateToken();
        console.log("jwt_token %s", jwt_token);
        this.githubService.accessToken(id, jwt_token)
            .then((data) => {
                console.log("jwt_token %s")
                console.log("Token %s", data.token);
            })
            .catch((err) => {
                console.log("Error %s", err);
                console.log("Config %s", JSON.stringify(err.config));
            });

    }

    @Post("hooks")
    hooks(@Req() request) {
        const payload = request.body;
        if (payload.action == "created"
            && payload.installation) {
            this.githubService.createInstallation(payload);
        }
    }
}
