import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { MethodOptions, RestApi, Cors, LambdaIntegration, Resource, CognitoUserPoolsAuthorizer, AuthorizationType } from 'aws-cdk-lib/aws-apigateway';



type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';



function createLambdaIntegrations(lambdas: {[key: string]: NodejsFunction}) {
  const lambdaIntegrations: {[key: string]: LambdaIntegration} = {};
  function createLambdaIntegration(lambda: NodejsFunction) { return new LambdaIntegration(lambda) };
  Object.keys(lambdas).forEach((key) => {  
    lambdaIntegrations[`${key}`] = createLambdaIntegration(lambdas[`${key}`]); 
  });
  return lambdaIntegrations;
}

function createResource(props: {pathName: string, api: RestApi}) {
  const { pathName, api } = props;
  const resource = api.root.addResource(pathName);
  return resource;
}

function addFunctionToResource(props: {resource: Resource, lambdaIntegration: LambdaIntegration, method: ApiMethod, authorizer?: CognitoUserPoolsAuthorizer}) {
  const { resource, lambdaIntegration, method, authorizer } = props;
  if (authorizer) {
    const options: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {authorizerId: authorizer.authorizerId},
    };
    resource.addMethod(method, lambdaIntegration, options);
  }
  else resource.addMethod(method, lambdaIntegration);
}

function addTagEndpoints(props: {api: RestApi, lambdaIntegrations: {[key: string]: LambdaIntegration}, authorizer: CognitoUserPoolsAuthorizer}) {
  const { api, lambdaIntegrations, authorizer } = props;
  const resource = createResource({pathName: 'tags', api});
  addFunctionToResource({resource, lambdaIntegration: lambdaIntegrations['tagCreateLambda'], method: 'POST', authorizer});
  addFunctionToResource({resource, lambdaIntegration: lambdaIntegrations['tagGetLambda'], method: 'GET'});
  const pathParamsResource = resource.addResource('{id}');
  addFunctionToResource({resource: pathParamsResource, lambdaIntegration: lambdaIntegrations['tagUpdateLambda'], method: 'PUT', authorizer});
  addFunctionToResource({resource: pathParamsResource, lambdaIntegration: lambdaIntegrations['tagDeleteLambda'], method: 'DELETE', authorizer});
}

function addCategoryEndpoints(props: {api: RestApi, lambdaIntegrations: {[key: string]: LambdaIntegration}, authorizer: CognitoUserPoolsAuthorizer}) {
  const { api, lambdaIntegrations, authorizer } = props;
  const resource = createResource({pathName: 'categories', api});
  addFunctionToResource({resource, lambdaIntegration: lambdaIntegrations['categoryCreateLambda'], method: 'POST', authorizer});
  addFunctionToResource({resource, lambdaIntegration: lambdaIntegrations['categoryGetLambda'], method: 'GET'});
  const pathParamsResource = resource.addResource('{id}');
  addFunctionToResource({resource: pathParamsResource, lambdaIntegration: lambdaIntegrations['categoryUpdateLambda'], method: 'PUT', authorizer});
  addFunctionToResource({resource: pathParamsResource, lambdaIntegration: lambdaIntegrations['categoryDeleteLambda'], method: 'DELETE', authorizer});
}

function addItemEndpoints(props: {api: RestApi, lambdaIntegrations: {[key: string]: LambdaIntegration}, authorizer: CognitoUserPoolsAuthorizer}) {
  const { api, lambdaIntegrations, authorizer } = props;
  const resource = createResource({pathName: 'items', api});
  addFunctionToResource({resource, lambdaIntegration: lambdaIntegrations['itemCreateLambda'], method: 'POST', authorizer});
  addFunctionToResource({resource, lambdaIntegration: lambdaIntegrations['itemGetLambda'], method: 'GET'});
  const pathParamsResource = resource.addResource('{id}');
  addFunctionToResource({resource: pathParamsResource, lambdaIntegration: lambdaIntegrations['itemUpdateLambda'], method: 'PUT', authorizer});
  addFunctionToResource({resource: pathParamsResource, lambdaIntegration: lambdaIntegrations['itemDeleteLambda'], method: 'DELETE', authorizer});
}

function addGetUploadUrlEndpoint(props: {api: RestApi, lambdaIntegrations: {[key: string]: LambdaIntegration}, authorizer: CognitoUserPoolsAuthorizer}) {
  const { api, lambdaIntegrations, authorizer } = props;
  const resource = createResource({pathName: 'getuploadurl', api});
  addFunctionToResource({resource, lambdaIntegration: lambdaIntegrations['getUploadUrlLambda'], method: 'POST', authorizer});
}

export function attachLambdasToApi(props: {api: RestApi, lambdas: {[key: string]: NodejsFunction}, authorizer: CognitoUserPoolsAuthorizer}) {
  const { api, lambdas, authorizer } = props;
  const lambdaIntegrations = createLambdaIntegrations(lambdas);
  addTagEndpoints({api, lambdaIntegrations, authorizer});
  addCategoryEndpoints({api, lambdaIntegrations, authorizer});
  addItemEndpoints({api, lambdaIntegrations, authorizer});
  addGetUploadUrlEndpoint({api, lambdaIntegrations, authorizer});
}