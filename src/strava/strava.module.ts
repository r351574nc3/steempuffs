import { Module, HttpModule } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { StravaService } from './strava.service';

@Module({
  imports: [HttpModule],
  exports: [StravaService],
  controllers: [
    ActivityController
  ],
  providers: [
    StravaService
  ],
})
export class StravaModule {}
