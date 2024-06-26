# CDK HANDBOOK
A handbook to aws serverless stack. <br />



### FEATURES
- advanced(ish) DynamoDB requests with aws-sdk v.3
- Lambdas for db CRUD operations
- public-read Bucket with PutItem signedUrl to upload images from frontend
- Cognito Authorizer
- AWS Policies and Tags
- EventBus (lambda to lambda)
- Next.js frontend

should add more features in the near future <br />



### SETUP
<sub>NODEJS:</sub>
- `$ nvm install 20.12.2`
- `$ nvm use 20.12.2`

<sub>AWS:</sub>
- install aws cli (this project uses 2.15.10)
- create aws iam admin user
- `$ npm i -g aws-cdk` (this project uses 2.138)
- `$ aws configure profile ferohriadeladmin` (and paste in accessKey & secretAccessKey, region: us-east-1, output format: json)

<sub>ENVIRONMENT VARIABLES:</sub>
- in the root of the project create a file called: .env
- put in your data:

ACCOUNT_ID=582602607164 <br />
REGION=us-east-1 <br />
APP_NAME=AwsHandbook <br />
USERPOOL_ID=us-east-1_CDhcQ9pou
USERPOOL_CLIENT_ID=7o397d7j6tvtrbt999g9mgro8a
<br />





