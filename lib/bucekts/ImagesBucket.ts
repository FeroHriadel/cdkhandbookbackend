import { Bucket, HttpMethods, BucketPolicy, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { PolicyStatement, Effect, AnyPrincipal, ArnPrincipal } from "aws-cdk-lib/aws-iam";
import * as dotenv from 'dotenv';
dotenv.config();



const accountId = process.env.ACCOUNT_ID;
const region = process.env.REGION;



export class ImagesBucket {
    public bucket: Bucket;
    private stack: Stack;
    private bucketAccessTag: string;

    constructor(stack: Stack, props: {bucketAccessTag: string}) {
        this.stack = stack;
        this.bucketAccessTag = props.bucketAccessTag;
        this.initialize();
    }

    private initialize() {
        this.createBucket();
        this.addPutObjectStatement();
        this.addReadWriteStatement();
    }

    private createBucket() {
        this.bucket = new Bucket(this.stack, 'cdk-handbook-images-bucket', {
            bucketName: process.env.APP_NAME + 'cdk-handbook-images-bucket-30krk3o',
            objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED, //enables ACLs (else image upload from website fails)
            blockPublicAccess: {blockPublicAcls: false, ignorePublicAcls: false, blockPublicPolicy: false, restrictPublicBuckets: false}, //enables adding bucket policy from cdk - cdk can't deploy bucket w/o this
            cors: [{ //open bucket to the internet
                allowedMethods: [
                  HttpMethods.HEAD,
                  HttpMethods.GET,
                  HttpMethods.PUT,
                  HttpMethods.POST,
                  HttpMethods.DELETE,
                ],
                allowedOrigins: ['*'],
                allowedHeaders: ['*']
            }],
            publicReadAccess: true, //so website can display images w/o having to do GetObject signed link
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });
    }

    private addPutObjectStatement() {
        const putObjectStatement = new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['s3:PutObject'],
            resources: [this.bucket.bucketArn + '/*'],
            principals: [new AnyPrincipal()] //wouldn't be possible to upload from FE without this
        });
        this.bucket.addToResourcePolicy(putObjectStatement);
    }

    private addReadWriteStatement() {
        const readWriteStatement = new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['s3:*'],
            resources: [this.bucket.bucketArn + '/*'],
            principals: [new AnyPrincipal()], //anyone can read/write - but...
            conditions: {
                "StringLike": {
                    [`aws:PrincipalTag/${this.bucketAccessTag}`]: [this.bucketAccessTag], //...must have bucketAccessTag
                    "aws:PrincipalArn": [`arn:aws:iam::${accountId}:role*`] //...and must be from my account
                },
            }
        });
        this.bucket.addToResourcePolicy(readWriteStatement);
    }
}