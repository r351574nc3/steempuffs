/*
 * @fileOverview DynamoDB Service, leverages dynamodb-data-mapper from AWS Labs
 * @see https://awslabs.github.io/dynamodb-data-mapper-js/
 */
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';

export const DYNAMODB_CONFIG = {
  endpoint: process.env.DYNAMODB_HOST || 'http://dynamodb.us-east-1.amazonaws.com',
  region: process.env.AWS_REGION || 'local',
  // DynamoDB local seems to require access/secret keys, even if they are dummy values
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
};

@Injectable()
export class DynamoDBService {
  // @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
  // @see https://github.com/awslabs/dynamodb-data-mapper-js
  public client: DynamoDB;  // Lower-level DynamoDB API
  public mapper: DataMapper;  // Higher-level Data mapper API
  constructor() {
    console.log("Config %s", JSON.stringify(DYNAMODB_CONFIG))
    this.client = new DynamoDB(DYNAMODB_CONFIG);
    this.mapper = new DataMapper({ client: this.client });
  }
}