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
APP_NAME=AwsHandbook
GITHUB_REPO_NAME=FeroHriadel/cdkhandbookbackend
```
<br />

- If you choose deployment without pipeline you are good to go.
- If you choose deployment with pipeline:

```
For easy sailing push .env to github. I would recommend private repo then.
Alternatively, rework the code to get the .env values from SecretsManager, ParametersStore, CodeCommit or idk...
```
<br />
<br />
<br />



### DEPLOY
- decide if you want a) pipeline with dev and prod stages or prefer b) to deploy from your machine. 

<br />


<sub> a) Yo want to deploy from your machine: </sub>
- go to `/bin/backend.ts`. Comment in this code:
```
/***** PROJECT STACK WITHOUT PIPELINE *****/
/***** uncomment if you don't want pipeline and comment out PipelineStack *****/
new AwsHandbookStack(app, `${process.env.APP_NAME}Stack`, {
    env: {account: process.env.ACCOUNT_ID, region: process.env.REGION}, //not required - disables deploying to other than specified account & region
    stackName: process.env.APP_NAME //not required - in case you wanted to prefix a bucket with app name, etc...
});
```
- and comment out this code:
```
/***** PROJECT STACK WITH PIPELINE *****/
/***** comment out if you don't want a pipeline and uncomment AwsHandbookStack *****/
new PipelineStack(app, 'AwsHandbookPipelineStack', {
    env: {account: process.env.ACCOUNT_ID, region: process.env.REGION},
    stackName: `${process.env.APP_NAME}-w-Pipeline`
});
```

- `$ cdk deploy --profile ferohriadeladmin`
- once deployment is done it should print api endpoint, cognito userpool id, cognito userpool client id... in the terminal. FE will need those. 

<br />

<sub> b) You want to have a pipeline and dev and prod stages </sub>
- Pipeline will need the values in the .env file.
- For easy sailing make a private repo and push it with the rest of your code (nothing that private in it anyway)
- Else rework the code to get the values from ParameterStore, SecretsManager, idk.
- Or use CodeCommit and include .env in the push. Anyone with an access to your CodeCommit can see the account id anyway.
- the pipeline logic is:

```
Pipeline starts rebuilding code everytime there's a push to your github/dev branch.
You can use the `main` branch for the final and bestest code. Pipeline is not attached to it. Do with `main` as you deem fit.
For development devs don't use this code with the pipeline version. They deploy their own stack from their own machines (see `a) Yo want to deploy from your machine:`) above.
When dev is done with a feature they push it to the `dev` branch
It triggers rebuild of the `dev` stage.
If all ok, the responisble person manually approves build for `prod`
```


