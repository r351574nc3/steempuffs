/*
 * @file Preferences Service, leverages DynamoDB Service
 * @see https://docs.nestjs.com/providers
 */
import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
  } from '@nestjs/common';
  
import { DynamoDBService } from '../core/persistance.service';
import { Preference } from './preference.schema';

const DB_LOG_CONTEXT = 'DYNAMODB';

@Injectable()
export class PreferencesService {
    constructor(private db: DynamoDBService) {
    }

    async fetchAllBy(principalId: string): Promise<Preference[]> {
        // Fetch all preferences for a unique identifier
        const results = [];
        const query = this.db.mapper.query(Preference, { principalId });
        for await (const item of query) {
            results.push(item);
        }
        return results;
    }

    async fetchBy(principalId: string, preferenceKey: string): Promise<Preference> {
        try {
            return await this.getPreference(principalId, preferenceKey);
        } catch (err) {
            throw new NotFoundException('Preference not found');
        }
    }

    async put(principalId: string, preferenceKey: string, preferenceValue: string) {
        // Ensure preference value payload is a stringified JSON object as needed
        if (typeof preferenceValue !== 'string') {
            preferenceValue = JSON.stringify(preferenceValue);
        }

        // Create or update (upsert) a preference
        return this.getPreference(principalId, preferenceKey)
        .then(async (preference) => {
            // Found existing preference, so use mapper.update()
            preference.preferenceValue = preferenceValue;
            preference.updatedAt = new Date();
            await this.db.mapper.update(preference);
            Logger.log(`Updated preference ${preferenceKey} for id ${principalId}`, DB_LOG_CONTEXT);
            return preference;
        })
        .catch(async () => {
            // Create new preference via mapper.put()
            const preference = Object.assign(new Preference(), {
                preferenceKey, preferenceValue, principalId,
            });
            const preferenceResult = await this.db.mapper.put(preference);
            Logger.log(`Created preference ${preferenceKey} for id ${principalId}`, DB_LOG_CONTEXT);
            return preferenceResult;
        })
        .catch(err => {
            // Surface DB exception in 500 response
            Logger.error(err, DB_LOG_CONTEXT);
            throw new InternalServerErrorException(`${err.code}: ${err.message}`);
        });
    }

    async remove(principalId: string, preferenceKey: string): Promise<Preference> {
        const deleted = await this.db.mapper.delete(
            Object.assign(new Preference(), { principalId, preferenceKey }),
        );
        if (!deleted) {
            throw new NotFoundException('Preference not found');
        }
        Logger.log(`Deleted preference ${preferenceKey} for id ${principalId}`, DB_LOG_CONTEXT);
        return deleted;
    }

    private async getPreference(principalId: string, preferenceKey: string): Promise<Preference> {
        return this.db.mapper.get(Object.assign(new Preference(), { principalId, preferenceKey }));
    }
}