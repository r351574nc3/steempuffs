/*
 * @fileOverview Schema for a Github object stored in DynamoDB, leveraging data mapper annotations
 * @see https://www.npmjs.com/package/@aws/dynamodb-data-mapper-annotations
 */
import {
    attribute,
    hashKey,
    rangeKey,
    table,
    versionAttribute,
  } from '@aws/dynamodb-data-mapper-annotations';
import { CodeRepositorySummary } from 'aws-sdk/clients/sagemaker';
  
const DB_TABLE_NAME = process.env.DYNAMODB_TABLE || 'GithubInstalls';

interface GithubInstallationEvent {
    action: string;
    installation: GithubInstallation;
}

export class GithubAccount {
    @attribute()
    login: string;

    @attribute()
    id: number;

    @attribute()
    node_id: string;

    @attribute()
    avatar_url: string;

    @attribute()
    gravatar_id: string;

    @attribute()
    url: string;

    @attribute()
    html_url: string;

    @attribute()
    followers_url: string;

    @attribute()
    following_url: string;

    @attribute()
    gists_url: string;

    @attribute()
    starred_url: string;

    @attribute()
    subscriptions_url: string;

    @attribute()
    organizations_url: string

    @attribute()
    repos_url: string;

    @attribute()
    events_url: string;

    @attribute()
    received_events_url: string;

    @attribute()
    type: string;

    @attribute()
    site_admin: boolean;
}

export class GithubPermissions {
    @attribute()
    administration: string;

    @attribute()
    checks: string;

    @attribute()
    contents: string;

    @attribute()
    issues: string;

    @attribute()
    metadata: string;

    @attribute()
    pages: string;

    @attribute()
    pull_requests: string;

    @attribute()
    repository_hooks: string;

    @attribute()
    repsitory_projects: string;

    @attribute()
    statuses: string;

    @attribute()
    vulnerability_alerts: string;
}

export class RepositorySummary {
    @attribute()
    id: number;

    @attribute()
    node_id: string;

    @attribute()
    name: string;

    @attribute()
    full_name: string;

    @attribute()
    private: boolean;
}

export class GithubInstallation {
    @attribute()
    id: number;

    @attribute()
    account: GithubAccount;

    @attribute()
    repository_selection: string;

    @attribute()
    access_tokens_url: string;
    
    @attribute()
    repositories_url: string;

    @attribute()
    html_url: string;

    @attribute()
    app_id: number;

    @attribute()
    target_id: number;

    @attribute()
    permissions: GithubPermissions;

    @attribute()
    events: string[];

    @attribute()
    created_at: number;

    @attribute()
    updated_at: number;

    @attribute()
    single_file_name: string;

    @attribute()
    repositories: RepositorySummary[];

    sender: any;
}


@table(DB_TABLE_NAME)
export class InstallationEntry {
    @hashKey()
    app_id: number;

    @rangeKey()
    id: number;

    @attribute()
    payload?: GithubInstallation;  

    @attribute()
    createdAt: Date;

    @attribute()
    updatedAt: Date;

    @versionAttribute()
    version: number;
}