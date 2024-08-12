import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsHandbookStack } from '../lib/project-stack';
import * as dotenv from 'dotenv';
dotenv.config();



const app = new cdk.App();

new AwsHandbookStack(app, `${process.env.APP_NAME}Stack`, {
    env: {account: process.env.ACCOUNT_ID, region: process.env.REGION}, //not required - disables deploying to other than specified account & region
    stackName: process.env.APP_NAME //not required - in case you wanted to prefix a bucket with app name, etc...
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