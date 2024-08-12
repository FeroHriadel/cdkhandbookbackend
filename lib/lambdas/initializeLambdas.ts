import { Stack, Tags } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import * as dotenv from 'dotenv';
import { AppLambda } from "./AppLambda";
import { AppLambdas, EventBusData } from "../../models";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
dotenv.config();



interface InitLambdasProps {
    tables: {[key: string]: Table};
    buckets: {[key: string]: Bucket};
    policyStatements: {[key: string]: PolicyStatement};
    tags: {[key: string]: string};
    eventBusesData: {[key: string]: EventBusData};
}

interface InitTagLambdasProps {
    tables: {[key: string]: Table};
}

interface InitCategoriesLambdasProps {
    tables: {[key: string]: Table};
    buckets: {[key: string]: Bucket};
    policyStatements: {[key: string]: PolicyStatement};
    tags: {[key: string]: string};
}

interface InitGetUploadUrlProps {
    buckets: {[key: string]: Bucket};
    policyStatements: {[key: string]: PolicyStatement};
}

interface InitItemLambdaProps {
    tables: {[key: string]: Table};
    policyStatements: {[key: string]: PolicyStatement};
    eventBusesData: {[key: string]: EventBusData};
}

interface InitDeleteImagesLambdaProps {
    buckets: {[key: string]: Bucket};
    policyStatements: {[key: string]: PolicyStatement};
    tags: {[key: string]: string};
    eventBusesData: {[key: string]: EventBusData};    
}



const appLambdas: {[key: string]: NodejsFunction} = {};



const initializeTagLambdas = (stack: Stack, props: InitTagLambdasProps) => {
    //tag lambdas need access to TagsTable
    const { tables } = props;
    appLambdas.tagCreateLambda = new AppLambda(stack, {lambdaName: 'tagCreate', folder: 'tags', table: tables.tagsTable, tableWriteRights: true}).lambda;
    appLambdas.tagGetLambda = new AppLambda(stack, {lambdaName: 'tagGet', folder: 'tags', table: tables.tagsTable}).lambda;
    appLambdas.tagUpdateLambda = new AppLambda(stack, {lambdaName: 'tagUpdate', folder: 'tags', table: tables.tagsTable, tableWriteRights: true}).lambda;
    appLambdas.tagDeleteLambda = new AppLambda(stack, {lambdaName: 'tagDelete', folder: 'tags', table: tables.tagsTable, tableWriteRights: true}).lambda;
}

const initializeCategoryLambdas = (stack: Stack, props: InitCategoriesLambdasProps) => {
    //category lambdas need access to CategoriesTable and ImagesBucket (which involves bucketAccessPolicyStatement and bucketAccessTag)
    const { tables, buckets, policyStatements, tags } = props;
    appLambdas.categoryCreateLambda = new AppLambda(stack, {
        lambdaName: 'categoryCreate', 
        folder: 'categories', 
        table: tables.categoriesTable,
        tableWriteRights: true,
      }).lambda;
    appLambdas.categoryGetLambda = new AppLambda(stack, {
        lambdaName: 'categoryGet', 
        folder: 'categories',
        table: tables.categoriesTable,
      }).lambda;
    appLambdas.categoryUpdateLambda = new AppLambda(stack, {
        lambdaName: 'categoryUpdate', 
        folder: 'categories', 
        table: tables.categoriesTable, 
        tableWriteRights: true,
        bucket: buckets.imagesBucket,
        policyStatements: {bucketAccessStatement: policyStatements.bucketAccessStatement},
        tags: {bucketAccessTag: tags.bucketAccessTag}
      }).lambda;
    appLambdas.categoryDeleteLambda = new AppLambda(stack, {
        lambdaName: 'categoryDelete',
        folder: 'categories',
        table: tables.categoriesTable,
        tableWriteRights: true,
        bucket: buckets.imagesBucket,
        policyStatements: {bucketAccessStatement: policyStatements.bucketAccessStatement},
        tags: {bucketAccessTag: tags.bucketAccessTag}
      }).lambda;
}

const initializeGetUploadUrlLambda = (stack: Stack, props: InitGetUploadUrlProps) => {
    //needs access to ImagesBucket
    const { buckets, policyStatements } = props;
    appLambdas.getUploadUrlLambda = new AppLambda(stack, {
        lambdaName: 'getUploadUrl',
        folder: 'getUploadUrl',
        bucket: buckets.imagesBucket,
        policyStatements: {bucketAccessStatement: policyStatements.bucketAccessStatement},
    }).lambda;
}

const initializeItemLambdas = (stack: Stack, props: InitItemLambdaProps) => {
    //need access to ItemsTable, and deleteImagesBus
    const { tables, policyStatements, eventBusesData } = props;
    appLambdas.itemCreateLambda = new AppLambda(stack, {
        lambdaName: 'itemCreate',
        folder: 'items',
        table: tables.itemsTable,
        tableWriteRights: true,
    }).lambda;
    appLambdas.itemGetLambda = new AppLambda(stack, {
        lambdaName: 'itemGet',
        folder: 'items',
        table: tables.itemsTable,
    }).lambda;
    appLambdas.itemUpdateLambda = new AppLambda(stack, {
        lambdaName: 'itemUpdate',
        folder: 'items',
        table: tables.itemsTable,
        tableWriteRights: true,
        eventBusData: {
            source: eventBusesData.deleteImagesBus.source,
            detailType: eventBusesData.deleteImagesBus.detailType,
            busName: eventBusesData.deleteImagesBus.busName,
            ruleName: eventBusesData.deleteImagesBus.ruleName
        }
    }).lambda;;
    appLambdas.itemDeleteLambda = new AppLambda(stack, {
        lambdaName: 'itemDelete',
        folder: 'items',
        table: tables.itemsTable,
        tableWriteRights: true,
        eventBusData: {
            source: eventBusesData.deleteImagesBus.source,
            detailType: eventBusesData.deleteImagesBus.detailType,
            busName: eventBusesData.deleteImagesBus.busName,
            ruleName: eventBusesData.deleteImagesBus.ruleName
        }
    }).lambda;
}

const initializeDeleteImagesLambda = (stack: Stack, props: InitDeleteImagesLambdaProps) => {
    //needs access to s3 bucket and deleteImagesBus
    const { buckets, policyStatements, tags, eventBusesData } = props;
    appLambdas.deleteImagesLambda = new AppLambda(stack, {
        lambdaName: 'deleteImages',
        folder: 'deleteImages',
        bucket: buckets.imagesBucket,
        policyStatements: {bucketAccessStatement: policyStatements.bucketAccessStatement},
        eventBusData: {
            source: eventBusesData.deleteImagesBus.source,
            detailType: eventBusesData.deleteImagesBus.detailType,
            busName: eventBusesData.deleteImagesBus.busName,
            ruleName: eventBusesData.deleteImagesBus.ruleName
        },
        tags: {bucketAccessTag: tags.bucketAccessTag}
    }).lambda;
}

export const initializeLambdas = (stack: Stack, props: InitLambdasProps) => {
    const { tables, buckets, policyStatements, tags, eventBusesData } = props;
    initializeTagLambdas(stack, {tables});
    initializeCategoryLambdas(stack, {tables, buckets, policyStatements, tags});
    initializeGetUploadUrlLambda(stack, {buckets, policyStatements});
    initializeItemLambdas(stack, {tables, policyStatements, eventBusesData});
    initializeDeleteImagesLambda(stack, {buckets, policyStatements, tags, eventBusesData});
    return appLambdas;
}