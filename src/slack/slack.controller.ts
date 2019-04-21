import { 
    Get,
    Controller,
    Headers,
    HttpService,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException
} from '@nestjs/common';
import { SlackService } from './slack.service';
import { slack } from "../config";
import * as crypto from "crypto";


@Controller('slack')
export class SlackController {
    constructor(private readonly slackService: SlackService,
        private readonly httpService: HttpService) {}

    @Post("motd")
    motd(@Req() request) {
        const timestamp = request.headers['x-slack-request-timestamp'];
        const hmac = crypto.createHmac("sha256", slack.signing_secret);
        const sig_basestring = "v0:" + timestamp + ":" + JSON.stringify(request.body);

        console.log("Using basestring %s", sig_basestring);
        const signature = 'v0=' + hmac.update(sig_basestring).digest("hex");
        const slack_sig = request.headers["x-slack-signature"];

        const channel_id = request.body.channel_id;

        /*
        console.log("Comparing %s to %s", signature, slack_sig);
        if (signature != slack_sig) {
            throw new UnauthorizedException();
        }
POST https://slack.com/api/chat.postMessage
Content-type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
{
  "channel": "YOUR_CHANNEL_ID",
  "text": "Hello, world"
}        
        */

        this.slackService.send_motd(channel_id);

        console.log("")
    }

    @Post("events")
    events(@Req() request) {
        const timestamp = request.headers['x-slack-request-timestamp'];
        const hmac = crypto.createHmac("sha256", slack.signing_secret);
        const sig_basestring = 'v0:' + timestamp + ':' + JSON.stringify(request.body);
        const signature = 'v0=' + hmac.update(sig_basestring).digest("hex");
        const slack_sig = request.headers["x-slack-signature"];
        if (signature != slack_sig) {
            throw new UnauthorizedException();
        }

        if (request.body.challenge) {
            return request.body.challenge;
        }        


        console.log("")
    }
}