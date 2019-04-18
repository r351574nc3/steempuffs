import { Module, HttpModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { StravaController } from './strava.controller';
import { StravaService } from './strava.service';
import { StravaAccess } from './access.middleware';
import { StravaSchedule } from './strava.schedule';
import { PreferencesService } from '../steemit/preferences.service';
import { SteemitModule } from 'src/steemit/steemit.module';
import { DynamoDBModule } from '../core/persistance.module';

@Module({
  imports: [ DynamoDBModule, HttpModule, SteemitModule ],
  exports: [ StravaService, StravaAccess ],
  controllers: [
    ActivityController,
    StravaController
  ],
  providers: [
    PreferencesService,
    StravaAccess,
    StravaSchedule, 
    StravaService
  ],
})
export class StravaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StravaAccess)
      .forRoutes(StravaController)
  }
}
