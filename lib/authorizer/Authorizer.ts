import { CfnOutput, Duration, RemovalPolicy } from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer, RestApi } from "aws-cdk-lib/aws-apigateway";
import { UserPool, UserPoolClient, CfnUserPoolGroup } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import * as dotenv from 'dotenv';
dotenv.config();



export class Authorizer {

    /*
        IMPLEMENTING COGNITO:
            a) We create Cognito/UserPool => that's the database of signed-up users.
            b) We create Cognito/UserPool/UserPoolClient => in AWS a UserPool must have a client. That's the rules. Period.
            c) We create a Cognito/Authorizer for ApiGateway => ApiGateway will use the Authorizer and that will use the UserPool and UserPoolClient we created.
            d) We create a UserPoolGroup ('admin') - users belonging to the group will be considered admins.
    */

    private scope: Construct;
    private api: RestApi;
    private userPool: UserPool;
    private userPoolClient: UserPoolClient;
    public authorizer: CognitoUserPoolsAuthorizer;


    constructor(scope: Construct, props: {api: RestApi}) {
      this.scope = scope;
      this.api = props.api;
      this.initialize();
    }


    private initialize() {
      this.createUserPool();
      this.addUserPoolClient();
      this.createAuthorizer();
      this.createAdminGroup();
    }

    private createUserPool() {
      this.userPool = new UserPool(this.scope, `${process.env.APP_NAME}UserPool`, {
        userPoolName: `${process.env.APP_NAME}UserPool`,
        selfSignUpEnabled: true,
        signInAliases: {email: true},
        removalPolicy: RemovalPolicy.DESTROY,
        passwordPolicy: {minLength: 6, requireLowercase: false, requireDigits: false, requireSymbols: false, requireUppercase: false}
      });
      new CfnOutput(this.scope, 'USER POOL ID', {value: this.userPool.userPoolId}); //log userPoolId so you don't have to go to console for it
    }

    private addUserPoolClient() {
      this.userPoolClient = this.userPool.addClient(`${process.env.APP_NAME}UserPoolClient`, {
        userPoolClientName: `${process.env.APP_NAME}UserPoolClient`,
        authFlows: { //nobody knows what this is, just copy-paste it
          adminUserPassword: true,
          custom: true,
          userPassword: true,
          userSrp: true
        },
        generateSecret: false, //generate client secret? I think you might set it to true as well
        refreshTokenValidity: Duration.days(30), //must be btwn 60min and 1yr
        idTokenValidity: Duration.days(1), //must be btwn 5min and 1day. Must be shorter than refreshTokenValidity
        accessTokenValidity: Duration.days(1), //must be btwn 5min and 1day. Must be shorter than refreshTokenValidity
      });
      new CfnOutput(this.scope, `USER POOL CLIENT ID`, {value: this.userPoolClient.userPoolClientId});
    }

    private createAuthorizer() {
        this.authorizer = new CognitoUserPoolsAuthorizer(this.scope, `${process.env.APP_NAME}Authorizer`, {
            authorizerName: `${process.env.APP_NAME}Authorizer`,
            cognitoUserPools: [this.userPool],
            identitySource: 'method.request.header.Authorization' //look for `Authorization` in req.headers
        });
        this.authorizer._attachToApi(this.api);
    }

    private createAdminGroup() {
        new CfnUserPoolGroup(this.scope, 'admin', {
            groupName: 'admin',
            userPoolId: this.userPool.userPoolId,
        });
    }

}