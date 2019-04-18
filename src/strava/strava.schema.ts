/*
 * @fileOverview Shema for a Strava object stored in DynamoDB, leveraging data mapper annotations
 * @see https://www.npmjs.com/package/@aws/dynamodb-data-mapper-annotations
 */
import {
    attribute,
    hashKey,
    rangeKey,
    table,
    versionAttribute,
  } from '@aws/dynamodb-data-mapper-annotations';
  
  const DB_TABLE_NAME = process.env.DYNAMODB_TABLE || 'Strava';

  export interface DetailedAthlete {
    id: number;
    username: string;
    resource_state: number;
    firstname: string;
    lastname: string;
    city: string;
    state: string;
    country: string;
    sex: string;
    premium: boolean;
    created_at: Date;
    updated_at: Date;
    badge_type_id: number;
    profile_medium: string;
    profile: string;
    friend: string;
    follower: string;
    follower_count: number;
    friend_count: number;
    mutual_friend_count: number;
    athlete_type: number;
    date_preference: string;
    measurement_preference: string;
    ftp: number;
    weight: number;
    clubs: SummaryClub[];
    bikes: SummaryGear[];
    shoes: SummaryGear[];
  }

  export interface SummaryClub {
    id: number;
    resource_state: number;
    name: string;
    profile_medium: string;
    cover_photo: string;
    cover_photo_small: string;
    sport_type: string;
    city: string;
    state: string;
    country: string;
    private: boolean;
    member_count: number;
    verified: boolean;
    url: string;
  }

  export interface SummaryGear {
    id: number;
    resource_state: number;
    primary: boolean;
    name: string;
    distance: number;
  }

  export class StatisticsPeriod {
    @attribute()
    start?: Date;

    @attribute()
    duration?: number;
  }

  export class AthleteStatistics {
    username: string;

    period?: StatisticsPeriod;

    @attribute()
    total_distance?: number;

    @attribute()
    total_moving_time?: number;

    @attribute()
    total_elapsed_time?: number;

    @attribute()
    total_elevation_gain?: number;

    @attribute()
    total_heartbeats?: number;

    @attribute()
    max_speed?: number;

    @attribute()
    average_distance?: number;

    @attribute()
    average_moving_time?: number;

    @attribute()
    average_elapsed_time?: number;

    @attribute()
    average_elevation_gain?: number;

    @attribute()
    average_speed?: number;

    @attribute()
    average_heart_rate?: number;

    @attribute()
    total_achievement_count?: number;
}

  export interface MetaAthlete {
    id: number;
    external_id: string;
  }

  export enum ActivityType {
    AlpineSki = 1,
    BackcountrySki, 
    Canoeing, 
    Crossfit, 
    EBikeRide, 
    Elliptical, 
    Golf, 
    Handcycle, 
    Hike, 
    IceSkate, 
    InlineSkate, 
    Kayaking, 
    Kitesurf, 
    NordicSki, 
    Ride, 
    RockClimbing, 
    RollerSki, 
    Rowing, 
    Run, 
    Sail, 
    Skateboard, 
    Snowboard, 
    Snowshoe, 
    Soccer, 
    StairStepper, 
    StandUpPaddling, 
    Surfing, 
    Swim, 
    Velomobile, 
    VirtualRide, 
    VirtualRun, 
    Walk, 
    WeightTraining, 
    Wheelchair, 
    Windsurf, 
    Workout, 
    Yoga
  }

  export interface PolylineMap {
    id: number;
    polyline: string;
    summary_polyline: string;
  }

  export interface SummaryActivity {
    id: number;
    external_id: string;
    upload_id: number
    athlete: MetaAthlete;
    name: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    total_elevation_gain: number;
    elev_high: number;
    elev_low: number;
    type: ActivityType;
    start_date: Date;
    start_date_local: Date;
    timezone: string;
    start_latlng: number[];
    end_latlng: number[];
    achievement_count: number;
    kudos_count: number;
    comment_count: number;
    athlete_count: number;
    photo_count: number;
    total_photo_count: number;
    map: PolylineMap;
    trainer: boolean;
    commute: boolean;
    manual: boolean;
    private: boolean;
    flagged: boolean;
    workout_type: number;
    average_speed: number;
    max_speed: number;
    has_kudoed: number;
    gear_id: string;
    kilojoules: number;
    average_watts: number;
    device_watts: number;
    max_watts: number;
    weighted_average_watts: number;
  }

  export interface DetailedActivity {
    id: number;
    external_id: string;
    upload_id: number
    athlete: MetaAthlete;
    name: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    total_elevation_gain: number;
    elev_high: number;
    elev_low: number;
    type: ActivityType;
    start_date: Date;
    start_date_local: Date;
    timezone: string;
    start_latlng: number[];
    end_latlng: number[];
    achievement_count: number;
    kudos_count: number;
    comment_count: number;
    athlete_count: number;
    photo_count: number;
    total_photo_count: number;
    map: PolylineMap;
    trainer: boolean;
    commute: boolean;
    manual: boolean;
    private: boolean;
    flagged: boolean;
    workout_type: number;
    average_speed: number;
    max_speed: number;
    has_kudoed: number;
    gear_id: string;
    kilojoules: number;
    average_watts: number;
    device_watts: number;
    max_watts: number;
    weighted_average_watts: number;
    description: string;
    photos: any;
    gear: any;
    calories: number;
    segment_efforts: any;
    device_name: string;
    embed_token: string;
    splits_metric: any;
    splits_standard: any;
    laps: any;
    best_efforts: any;
  }

  export interface Lap {

  }

  @table(DB_TABLE_NAME)
  export class StravaDocument {
    @hashKey()
    principalId: string;

    @rangeKey()
    objectKey: string;

    @attribute()
    statistics?: AthleteStatistics;  

    @attribute()
    createdAt: Date;
  
    @attribute()
    updatedAt: Date;
  
    @versionAttribute()
    version: number;
  }