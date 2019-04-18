import { HttpService, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { StravaRefreshResult, StravaTokenResult } from "../dto";
import { PreferencesService } from '../steemit/preferences.service';
import { strava_cid, strava_secret } from "../config";
import { AxiosResponse } from "axios";
import { strava_watch } from "../config";
import { DetailedAthlete, DetailedActivity, SummaryActivity } from "./strava.schema";
import { DynamoDBService } from '../core/persistance.service';
import { AthleteStatistics, StatisticsPeriod, StravaDocument } from './strava.schema';
import * as P from "bluebird";


global.Promise = P;
const TOKEN_URL = "https://www.strava.com/oauth/token";
const STRAVA_API_URL = "https://www.strava.com/api/v3";
const DB_LOG_CONTEXT = 'DYNAMODB';
const HOUR_IN_MILLISECONDS = 3600000;

@Injectable()
export class StravaService {
    access_token: string;

    constructor(private db: DynamoDBService,
                private readonly httpService: HttpService,
                private readonly preferencesService: PreferencesService) {
        this.getAccessToken(strava_watch)
            .then((token) => {
                this.access_token = token;
            });
    }

    getActivity(): string {
        return '';
    }

    getAthlete(): Promise<DetailedAthlete> {
        return this.httpService.get(
            STRAVA_API_URL + "/athlete",
            {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.access_token}`
                }
            }
        )
        .toPromise()
        .then((response: AxiosResponse<DetailedAthlete>) => {
            return response.data;
        });
    }

    getActivitiesFor(athlete: DetailedAthlete): Promise<SummaryActivity[]> {
        return this.httpService.get(
            STRAVA_API_URL + `/athlete/activities`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.access_token}`
                }
            }
        )
        .toPromise()
        .then((response: AxiosResponse<SummaryActivity[]>) => {
            return response.data;
        });
    }

    grantAccessTo(principalId: string, token_data: StravaTokenResult) {
        this.preferencesService.put(principalId, "strava_token", token_data.refresh_token);
    }

    getAccessToken(principalId: string): Promise<string> {
        return this.preferencesService.fetchBy(principalId, "strava_token")
            .then((preference) => {
                const refresh_token = preference.preferenceValue;
                return this.httpService.post(
                    TOKEN_URL,
                    {
                        client_id: strava_cid,
                        client_secret: strava_secret,
                        grant_type: "refresh_token",
                        scope: "read",
                        refresh_token: refresh_token
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .toPromise()
                .then((results: AxiosResponse<StravaRefreshResult>) => {
                    return results.data.access_token;
                })
                .catch((err) => {
                    console.log("Error %s", err);
                    return "blah";
                });
            });
    }


    async getRecentActivities(athlete: DetailedAthlete): Promise<DetailedActivity[]> {
        const hour_start_time = (new Date().getTime() - HOUR_IN_MILLISECONDS) / 1000;
        
        return this.httpService.get(
            STRAVA_API_URL + `/athlete/activities`,
            {
                params: {
                    after: hour_start_time
                },
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.access_token}`
                }
            }
        )
        .toPromise()
        .then((response: AxiosResponse<SummaryActivity[]>) => {
            return response.data;
        })
        .then((activities: SummaryActivity[]): Promise<DetailedActivity[]> => {
            return P.map(activities, (activity: SummaryActivity): Promise<DetailedActivity> => {
                return this.getDetailedActivityBy(activity.id)
            });
        });
    }

    private async getDetailedActivityBy(id: number): Promise<DetailedActivity> {
        return await this.httpService.get(
            STRAVA_API_URL + `/activities/${id}`,
            {
                params: {
                    include_all_efforts: true
                },
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.access_token}`
                }
            }
        )
        .toPromise()
        .then((response: AxiosResponse<DetailedActivity>): DetailedActivity => {
            return response.data;
        });
    }

    private getWeekStart(): Date {
        const retval = new Date();
        if (retval.getUTCDay() > 0) {
            const new_date = retval.getDate() - retval.getUTCDay()
            retval.setDate(new_date);
        }
        retval.setHours(0);
        retval.setMinutes(0);
        retval.setSeconds(0);
        retval.setMilliseconds(0);
        return retval;
    }

    getWeeklyStatsFor(athlete: DetailedAthlete): Promise<AthleteStatistics> {
        const week_start = this.getWeekStart();
        const week_start_time = week_start.getTime() / 1000;
        const period: StatisticsPeriod = {
            start: week_start,
            duration: 604800000
        };

        console.log("Fetching activities %s", `/athlete/activities`);
        return this.httpService.get(
            STRAVA_API_URL + `/athlete/activities`,
            {   
                params: {
                    after: week_start_time
                },
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.access_token}`
                }
            }
        )
        .toPromise()
        .then((response: AxiosResponse<SummaryActivity[]>) => {
            return response.data;
        })
        .then((activities) => {
            const retval = new AthleteStatistics();
            retval.period = period
            retval.username = athlete.username;

            console.log("Got %s", activities.length);
            activities.forEach((activity) => {                
                retval.total_distance = retval.total_distance ? retval.total_distance + activity.distance: activity.distance;
                retval.total_moving_time = retval.total_moving_time ? retval.total_moving_time + activity.moving_time: activity.moving_time;
                retval.total_elapsed_time = retval.total_elapsed_time ? retval.total_elapsed_time + activity.elapsed_time: activity.elapsed_time;
                retval.total_elevation_gain = retval.total_elevation_gain ? retval.total_elevation_gain + activity.total_elevation_gain: activity.total_elevation_gain;                retval.total_achievement_count = retval.total_achievement_count ? retval.total_achievement_count + activity.achievement_count : activity.achievement_count;
                retval.max_speed = retval.max_speed > activity.max_speed ? retval.max_speed : activity.max_speed;
                retval.average_distance = retval.total_distance ? retval.total_distance / activities.length: activity.distance;
                retval.average_moving_time = retval.total_moving_time ? retval.total_moving_time / activities.length: activity.moving_time;
                retval.average_elevation_gain = retval.total_elevation_gain ? retval.total_elevation_gain / activities.length: activity.total_elevation_gain;
                retval.average_speed = retval.average_speed ? retval.average_speed / activities.length: activity.average_speed;
            });
            return retval;
        });
    }

    private async getStatistics(principalId: string, objectKey: string): Promise<StravaDocument> {
        return this.db.mapper.get(Object.assign(new StravaDocument(), { principalId, objectKey }));
    }

    async put(principalId: string, objectKey: string, statistics: AthleteStatistics) {
        return this.getStatistics(principalId, objectKey)
            .then(async (document) => {
                document.statistics = statistics;
                document.updatedAt = new Date();
                await this.db.mapper.update(document);
                Logger.log(`Updated statistics ${objectKey} for id ${principalId}`, DB_LOG_CONTEXT);
                return document;
            })
            .catch(async () => {
                // Create new preference via mapper.put()
                const document = Object.assign(new StravaDocument(), {
                    objectKey, statistics, principalId,
                });
                const documentResult = await this.db.mapper.put(document);
                Logger.log(`Created document ${objectKey} for id ${principalId}`, DB_LOG_CONTEXT);
                return documentResult;
            })
            .catch(err => {
                // Surface DB exception in 500 response
                Logger.error(err, DB_LOG_CONTEXT);
                throw new InternalServerErrorException(`${err.code}: ${err.message}`);
            });
    }
}
