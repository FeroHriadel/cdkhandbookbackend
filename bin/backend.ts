import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsHandbookStack } from '../lib/project-stack';
import { PipelineStack } from '../lib/pipeline-stack';
import * as dotenv from 'dotenv';
dotenv.config();



const app = new cdk.App();

/***** PROJECT STACK WITHOUT PIPELINE *****/
/***** uncomment if you don't want pipeline and comment out PipelineStack *****/
// new AwsHandbookStack(app, `${process.env.APP_NAME}Stack`, {
//     env: {account: process.env.ACCOUNT_ID, region: process.env.REGION}, //not required - disables deploying to other than specified account & region
//     stackName: process.env.APP_NAME //not required - in case you wanted to prefix a bucket with app name, etc...
// });



/***** PROJECT STACK WITH PIPELINE *****/
/***** comment out if you don't want a pipeline and uncomment AwsHandbookStack *****/
new PipelineStack(app, 'AwsHandbookPipelineStack', {
    env: {account: process.env.ACCOUNT_ID, region: process.env.REGION},
    stackName: `${process.env.APP_NAME}-w-Pipeline`
});

app.synth();

//TIP: you can deploy more stacks like this:
// - create /lib/some-other-stack.ts and put in this code:
//
// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// export class SomeOtherStack extends cdk.Stack {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);
//   }
// }
//
// in this file add this code:
// import { SomeOtherStack } from '../lib/some-other-stack';
// new SomeOtherStack(app, 'SomeOtherStack', {
//     env: {account: process.env.ACCOUNT_ID, region: process.env.REGION},
//     stackName: 'SomeOtherStack'
// });
//
// $ cdk deploy --all --profile ferohriadeladmin