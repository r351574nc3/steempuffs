import { Get, Controller } from '@nestjs/common';
import { StravaService } from './strava.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly stravaService: StravaService) {}

  @Get()
  getActivity(): string {
    return this.stravaService.getActivity();
  }
}
