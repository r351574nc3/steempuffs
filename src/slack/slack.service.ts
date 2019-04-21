import { HttpService, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PreferencesService } from '../steemit/preferences.service';
import { AxiosResponse } from "axios";
import { slack } from "../config";
import { DynamoDBService } from '../core/persistance.service';
import * as fs from "fs";
import * as jwt from "jsonwebtoken";
import * as P from "bluebird";


const DB_LOG_CONTEXT = 'DYNAMODB';
const SLACK_API_URL = "https://slack.com/api";

@Injectable()
export class SlackService {

    constructor(private db: DynamoDBService,
                private readonly httpService: HttpService,
                private readonly preferencesService: PreferencesService) {
    }

    motd() {
        return `
This is the message of the day. Here we will get a briefing of what's happening concerning the project. Things it will include are:
* Who's on support.
* What's hot right now. (What's being worked on like stories, issues, or conversations).
* Reminders
* PRs that need looking at
* Stories that have spent an excessive amount of time in the bucket
* Low hanging fruit
        `;
    }

    /**
     * Personal details sent to specific user
     * 
     * @param user_id 
     */
    send_briefing(user_id: string) {
        const briefing = `
This is your briefing. It includes
* issues you're working.
* issues that require communication.
* threads that you may be interested in based on what you're interested in.
* Number of meetings
* suggestions on strategy and what to do
        `;
    }

    send_motd(channel_id: string) {

        return this.httpService.post(
            SLACK_API_URL + "/chat.postMessage",
            {
                "channel": channel_id,
                "text": this.motd(),
            },
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${slack.access_token}`
                }
            }
        )
        .toPromise()
        .then((response: AxiosResponse<any>) => {
            return response.data;
        });
    }
}