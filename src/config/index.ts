export let port = process.env.APP_PORT || 3000;
export let secret = process.env.STEEMPUFFS_SECRET || "emptysecret";
export let strava_cid = process.env.STRAVA_CLIENT_ID;
export let strava_secret = process.env.STRAVA_SECRET;
export let strava_watch = process.env.STRAVA_WATCH_LIST;
export let github_app_id = process.env.GITHUB_APP_ID;
export let private_key = process.env.STEEMPUFFS_JWT_KEY;
export let slack = {
    app_id: process.env.SLACK_APP_ID,
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    signing_secret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_TOKEN,
    access_token: process.env.SLACK_ACCESS_TOKEN,
    bot_token: process.env.SLACK_BOT_ACCESS_TOKEN
};
