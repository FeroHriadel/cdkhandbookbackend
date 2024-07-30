# CDK HANDBOOK
A handbook to aws serverless stack. 

<br />
<br />
<br />



### FEATURES
- advanced(ish) DynamoDB requests with aws-sdk v.3
- Lambdas for db CRUD operations
- public-read Bucket with PutItem signedUrl to upload images from frontend
- Cognito Authorizer
- AWS Policies and Tags
- EventBus (lambda to lambda)
- optional Pipeline (with dev and prod stages)
- nextjs frontend is in a separate repo: `https://github.com/FeroHriadel/cdkhandbookfrontend`

<br />
<br />
<br />



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
- put in your data: <br />

```
ACCOUNT_ID=582602607164
REGION=us-east-1
APP_NAME=dev-aws-handbook
GITHUB_REPO_NAME=FeroHriadel/cdkhandbookbackend
```
<br />


```
For easy sailing push .env to github. I would recommend private repo then.
Alternatively, rework the code to get the .env values from SecretsManager, ParametersStore, CodeCommit or idk...
```
<br />
<br />
<br />
