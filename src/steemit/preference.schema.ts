/*
 * @fileOverview Shema for a Preference object stored in DynamoDB, leveraging data mapper annotations
 * @see https://www.npmjs.com/package/@aws/dynamodb-data-mapper-annotations
 */
import {
    attribute,
    hashKey,
    rangeKey,
    table,
    versionAttribute,
  } from '@aws/dynamodb-data-mapper-annotations';
  
  const DB_TABLE_NAME = process.env.DYNAMODB_TABLE || 'Preferences';
  
  @table(DB_TABLE_NAME)
  export class Preference {
    // NOTE: The hash and range key attrs here need to match those in serverless.yaml
    @hashKey()
    principalId: string;  // Unique id of user, account, etc.
    @rangeKey()
    preferenceKey: string;  // Preference key
    @attribute()
    preferenceValue: string;  // Preference value as stringified JSON object
    @attribute({ defaultProvider: () => new Date() })
    createdAt: Date;
  
    @attribute({ defaultProvider: () => new Date() })
    updatedAt: Date;
  
    @versionAttribute()
    version: number;
  
  }