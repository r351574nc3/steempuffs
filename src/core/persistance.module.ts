import { Module } from '@nestjs/common';

import { DynamoDBService } from './dynamodb.service';

@Module({
  exports: [DynamoDBService],
  providers: [DynamoDBService],
})
export class DynamoDBModule {
}