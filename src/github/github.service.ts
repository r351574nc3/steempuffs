import { HttpService, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PreferencesService } from '../steemit/preferences.service';
import { AxiosResponse } from "axios";
import { private_key, github_app_id } from "../config";
import { DynamoDBService } from '../core/persistance.service';
import { GithubInstallation, InstallationEntry } from './github.schema';
import * as fs from "fs";
import * as jwt from "jsonwebtoken";
import * as P from "bluebird";


const TEN_MINUTES = 60 * 10;
const ContentType = "application/vnd.github.machine-man-preview+json";
const GITHUB_API_URL = "https://api.github.com";
const DB_LOG_CONTEXT = 'DYNAMODB';

interface JwtResult {
    token: string;
    expires_at: Date;
}

@Injectable()
export class GithubService {

    constructor(private db: DynamoDBService,
                private readonly httpService: HttpService,
                private readonly preferencesService: PreferencesService) {
    }

    generateToken() {
        const pk = fs.readFileSync(private_key);
        const now = new Date();
        const payload = { 
            iat: Math.round(new Date().getTime() / 1000),
            exp: Math.round(new Date().getTime() / 1000) + TEN_MINUTES,
            iss: github_app_id
        };
        const token = jwt.sign(
            payload,
            pk,
            { algorithm: 'RS256'});
        return token;
    }

    accessToken(installation_id: string, jwt_token: string) {
        return this.httpService.post(
            GITHUB_API_URL + `/app/installations/${installation_id}/access_tokens`,{},
            {
                headers: {
                    "Accept": ContentType,
                    "Authorization": `Bearer ${jwt_token}`
                }
            }
        )
        .toPromise()
        .then((response: AxiosResponse<JwtResult>) => {
            return response.data;
        });
    }

    createInstallation(payload: any) {
        const installation: GithubInstallation = payload.installation;
        this.put(installation.app_id, installation.id, installation);
    }

    /**
     * 
     */
    handlePush(payload: any) {
        
    }

    /**
     * Pull requests can be created/modified/completed. When a PR is completed/merged into
     * the master, files that are changed should be examined. If changes include README.md
     * in the root, then a post should be made to steemit.
     * 
     * Whenever a PR is created, a blog post is created.
     */
    handlePullRequest(payload: any) {

    }

    /**
     * Upon creation of an issue, a blog post is created.
     */
    handleIssue(payload: any) {

    }

    /**
     * On comment, use preference in steempuffs to determine posting key to be used to post
     * back to steemit.
     */
    handleComment(payload: any) {

    }

    private async getInstallations(app_id: number, id: number): Promise<InstallationEntry> {
        return this.db.mapper.get(Object.assign(new InstallationEntry(), { app_id, id }));
    }

    async put(app_id: number, id: number, installation: GithubInstallation) {
        return this.getInstallations(app_id, id)
            .then(async (document) => {
                document.payload = installation;
                document.updatedAt = new Date();
                await this.db.mapper.update(document);
                Logger.log(`Updated installations ${id} for app ${app_id}`, DB_LOG_CONTEXT);
                return document;
            })
            .catch(async () => {
                // Create new preference via mapper.put()
                const document = Object.assign(new InstallationEntry(), {
                    id, installation, app_id,
                });
                const documentResult = await this.db.mapper.put(document);
                Logger.log(`Created document ${id} for id ${app_id}`, DB_LOG_CONTEXT);
                return documentResult;
            })
            .catch(err => {
                // Surface DB exception in 500 response
                Logger.error(err, DB_LOG_CONTEXT);
                throw new InternalServerErrorException(`${err.code}: ${err.message}`);
            });
    }
}
