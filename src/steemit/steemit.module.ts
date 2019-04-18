import { Module } from '@nestjs/common';
import { SteemitController } from './steemit.controller';
import { SteemitService } from './steemit.service';
import { PreferencesService } from './preferences.service';
import { DynamoDBModule } from '../core/persistance.module';

@Module({
  imports: [
    DynamoDBModule
  ],
  exports: [
    PreferencesService,
    SteemitService
  ],
  controllers: [
    SteemitController
  ],
  providers: [
    PreferencesService,
    SteemitService
  ],
})
export class SteemitModule {}
