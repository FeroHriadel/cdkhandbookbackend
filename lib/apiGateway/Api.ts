import * as cdk from 'aws-cdk-lib';
import { MethodOptions, RestApi, Cors, LambdaIntegration, Resource } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';



type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';



export class Api {
    public api: RestApi;
    private stack: cdk.Stack;
    private lambdas: {[key: string]: NodejsFunction};
    private lambdaIntegrations: {[key: string]: LambdaIntegration} = {};

    public constructor(stack: cdk.Stack, props: {lambdas: {[key: string]: NodejsFunction}}) {
        this.stack = stack;
        this.lambdas = props.lambdas;
        this.initialize();

    }

    private initialize() {
        this.initApi();
        this.logEndpoint();
        this.createLambdaIntegrations();
        this.addTagEndpoints();
        this.addCategoryEndpoints();
        this.addItemEndpoints();
        this.addGetUploadUrlEndpoint();
    }

    private initApi() {
        this.api = new RestApi(this.stack, `${this.stack.stackName}Api`, {
            defaultCorsPreflightOptions: {
               allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key'
               ],
               allowMethods: Cors.ALL_METHODS,
               allowCredentials: true,
               allowOrigins: Cors.ALL_ORIGINS
            }
        })
    }

    private logEndpoint() {
        new cdk.CfnOutput(this.stack, 'API ENDPOINT: ', {value: this.api.url});
    }

    private createLambdaIntegrations() {
        function createLambdaIntegration(lambda: NodejsFunction) { return new LambdaIntegration(lambda) };
        Object.keys(this.lambdas).forEach((key) => {  this.lambdaIntegrations[`${key}`] = createLambdaIntegration(this.lambdas[`${key}`]); });
    }

    private createResource(pathName: string) {
        const resource = this.api.root.addResource(pathName);
        return resource;
    }

    private addFunctionToResource(props: {resource: Resource, lambdaIntegration: LambdaIntegration, method: ApiMethod}) {
        const { resource, lambdaIntegration, method } = props;
        resource.addMethod(method, lambdaIntegration)
    }

    private addTagEndpoints() {
        const resource = this.createResource('tags');
        this.addFunctionToResource({resource, lambdaIntegration: this.lambdaIntegrations['tagCreateLambda'], method: 'POST'});
        this.addFunctionToResource({resource, lambdaIntegration: this.lambdaIntegrations['tagGetLambda'], method: 'GET'});
        const pathParamsResource = resource.addResource('{id}');
        this.addFunctionToResource({resource: pathParamsResource, lambdaIntegration: this.lambdaIntegrations['tagUpdateLambda'], method: 'PUT'});
        this.addFunctionToResource({resource: pathParamsResource, lambdaIntegration: this.lambdaIntegrations['tagDeleteLambda'], method: 'DELETE'});
    }

    private addCategoryEndpoints() {
        const resource = this.createResource('categories');
        this.addFunctionToResource({resource, lambdaIntegration: this.lambdaIntegrations['categoryCreateLambda'], method: 'POST'});
        this.addFunctionToResource({resource, lambdaIntegration: this.lambdaIntegrations['categoryGetLambda'], method: 'GET'});
        const pathParamsResource = resource.addResource('{id}');
        this.addFunctionToResource({resource: pathParamsResource, lambdaIntegration: this.lambdaIntegrations['categoryUpdateLambda'], method: 'PUT'});
        this.addFunctionToResource({resource: pathParamsResource, lambdaIntegration: this.lambdaIntegrations['categoryDeleteLambda'], method: 'DELETE'});
    }

    
    private addItemEndpoints() {
        const resource = this.createResource('items');
        this.addFunctionToResource({resource, lambdaIntegration: this.lambdaIntegrations['itemCreateLambda'], method: 'POST'});
        this.addFunctionToResource({resource, lambdaIntegration: this.lambdaIntegrations['itemGetLambda'], method: 'GET'});
        const pathParamsResource = resource.addResource('{id}');
        this.addFunctionToResource({resource: pathParamsResource, lambdaIntegration: this.lambdaIntegrations['itemUpdateLambda'], method: 'PUT'});
        this.addFunctionToResource({resource: pathParamsResource, lambdaIntegration: this.lambdaIntegrations['itemDeleteLambda'], method: 'DELETE'});
    }
    
    private addGetUploadUrlEndpoint() {
        const resource = this.createResource('getuploadurl');
        this.addFunctionToResource({resource, lambdaIntegration: this.lambdaIntegrations['getUploadUrlLambda'], method: 'POST'});
    }
    
}