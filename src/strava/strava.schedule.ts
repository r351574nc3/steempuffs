import { Injectable } from "@nestjs/common";
import { Cron, Interval, Timeout, NestSchedule, defaults } from 'nest-schedule';
import { StravaService } from './strava.service';
import { strava_watch } from "../config";


@Injectable()
export class StravaSchedule extends NestSchedule {
    constructor(private readonly stravaService: StravaService) {
        super();
    }

    @Interval(3600000)
    async weeklyStatsSync() {
        this.stravaService.getAthlete()
            .then((athlete) => {
                return this.stravaService.getWeeklyStatsFor(athlete)
            })
            .then((statistics) => {
                this.stravaService.put(statistics.username, JSON.stringify(statistics.period), statistics);

                console.log("Done");
            })
            .catch((err) => {
                console.log("Error %s", err);
            });
    }

    @Interval(120000)
    async hourlySync() {
        this.stravaService.getAthlete()
            .then((athlete) => {
                return this.stravaService.getRecentActivities(athlete)
            })
            .then((activities) => { 
                activities.forEach((activity) => {
                    console.log("Activity %s", activity.name);
                });
            });

    }
}