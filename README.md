# CDK HANDBOOK
A handbook to aws serverless stack. 

<br />
<br />
<br />



## FEATURES
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



## SETUP
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
APP_NAME=dev-aws-handbook   #change this if you want to deploy a different stage
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



## STAGES
Lesson learned in my team is to avoid piepeline stages and complicated setups. The best practice is to manage deployment/stages as follows:
Stages/Deployments of this app work like this:
1) to create a new stage/deployment just go to `/.env` and rename `APP_NAME` to something else.
2) It is assumed in this app that `dev` stage will have appName: `dev-aws-handbook`.
3) It is assumed in this app that `prod` stage will have appName: `prod-aws-handbook`.
4) Other deployments/stages can be created as simple as renaming `APP_NAME` in `/.env` file to a desired stage/deployment name. E.g.: each developer can have their own deployment w/o interfering with others.
5) `/lib/project-stack.ts` is set-up to create a cicd pipeline for `dev` and `prod` stages/deployments:
```
  initPipeline() {
    //only create pipeline for `dev` and `prod` stages:
    if (this.stackName.startsWith('dev')) this.pipeline = initializePipeline(this, {branch: 'dev'});
    if (this.stackName.startsWith('prod')) this.pipeline = initializePipeline(this, {branch: 'main'});
  }
```
6) Other than `dev` and `prod` stages/deployments have no pipeline. If needed just edit the `initPipeline()` function in `/lib/project-stack.ts`.


