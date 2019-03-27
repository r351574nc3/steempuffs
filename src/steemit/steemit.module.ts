import { Module } from '@nestjs/common';
import { SteemitController } from './steemit.controller';
import { SteemitService } from './steemit.service';

@Module({
  imports: [],
  exports: [SteemitService],
  controllers: [
    SteemitController
  ],
  providers: [
    SteemitService
  ],
})
export class SteemitModule {}
