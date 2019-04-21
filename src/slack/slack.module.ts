import { Module, HttpModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { PreferencesService } from '../steemit/preferences.service';
import { SteemitModule } from 'src/steemit/steemit.module';
import { DynamoDBModule } from '../core/persistance.module';

@Module({
  imports: [ DynamoDBModule, HttpModule ],
  exports: [ SlackService ],
  controllers: [
    SlackController
  ],
  providers: [
    PreferencesService,
    SlackService
  ],
})
export class SlackModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}
