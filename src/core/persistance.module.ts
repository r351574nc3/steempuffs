
import { Module } from '@nestjs/common';

import { DynamoDBService } from './persistance.service';

@Module({
  exports: [ DynamoDBService ],
  providers: [ DynamoDBService ],
})
export class DynamoDBModule {
}