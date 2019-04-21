import { HttpModule, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { OAuthController } from './oauth.controller';
import { AppService } from './app.service';
import { StravaAccess } from './strava/access.middleware';
import { GithubModule } from './github/github.module';
import { GithubController } from './github/github.controller';
import { SlackController } from './slack/slack.controller';
import { SlackModule } from './slack/slack.module';
import { StravaModule } from './strava/strava.module';
import { SteemitModule } from './steemit/steemit.module';
import { OAuth2 } from './core/auth.middleware';
import { JwtService } from './core/jwt.service';
import { DynamoDBService } from './core/persistance.service';
import { SteemitController } from './steemit/steemit.controller';
import { PreferencesService } from './steemit/preferences.service';

@Module({
  imports: [
    GithubModule,
    HttpModule,
    JwtService,
    SlackModule,
    StravaModule,
    SteemitModule
  ],
  controllers: [
    AppController,
    GithubController,
    OAuthController,
    SlackController,
    SteemitController
  ],
  providers: [
    AppService,
    DynamoDBService,
    JwtService,
    PreferencesService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OAuth2)
      .forRoutes(SteemitController, AppController)
  }
}
