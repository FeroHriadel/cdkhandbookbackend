import { Table } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket } from "aws-cdk-lib/aws-s3";



export interface AppTables {
    [key: string]: Table;
}

export interface AppBuckets {
    [key: string]: Bucket;
}

export interface AppLambdas {
    [key: string]: NodejsFunction;
}

export interface AppPolicyStatements {
    [key: string]: PolicyStatement
}

export interface TagsTableFields {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    type: '#TAG'
}

export interface CategoriesTableFields {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
    image: string;
    type: '#CATEGORY';
}

export interface ItemsTableFields {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy: string;
    type?: '#ITEM';
    namesearch?: string;
    name?: string;
    description?: string;
    tags?: string[];
    category?: string;
    images?: string[];
}

export interface EventBusData {
    source: string[]; 
    detailType: string[];
    busName: string;
    ruleName: string;
}


