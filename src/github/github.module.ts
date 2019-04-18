import { Module, HttpModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { PreferencesService } from '../steemit/preferences.service';
import { SteemitModule } from 'src/steemit/steemit.module';
import { DynamoDBModule } from '../core/persistance.module';

@Module({
  imports: [ DynamoDBModule, HttpModule ],
  exports: [ GithubService ],
  controllers: [
    GithubController
  ],
  providers: [
    PreferencesService,
    GithubService
  ],
})
export class GithubModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}
