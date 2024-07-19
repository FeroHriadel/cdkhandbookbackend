import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Api } from './apiGateway/Api';
import { AppTables, AppBuckets, AppLambdas, AppPolicyStatements } from '../models';
import { initializeTables } from './tables/initializeTables';
import { initializeBuckets } from './bucekts/initializeBuckets';
import { initializePolicyStatements } from './policyStatements/initializePolicyStatements';
import { initializeLambdas } from './lambdas/initializeLambdas';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { DeleteImagesEventBus } from './eventBuses/DeleteImagesEventBus';
import { Authorizer } from './authorizer/Authorizer';
import { CognitoUserPoolsAuthorizer, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { attachLambdasToApi } from './lambdas/attachLambdasToApi';



export class AwsHandbookStack extends cdk.Stack {
  //eventBus details:
  readonly deleteImagesBusSource = ['delete.images.bus.source'];
  readonly deleteImagesBusDetailType = ['DeleteImagesDetailType'];
  readonly deleteImagesEventBusName = 'DeleteImagesBus';
  readonly deleteImagesEventBusRuleName = 'DeleteImagesBusRule';

  //tags:
  readonly bucketAccessTag = 's3access';

  //app resources:
  private tables: AppTables;
  private buckets: AppBuckets;
  private policyStatements: AppPolicyStatements;
  private lambdas: AppLambdas;
  private buses: {[key: string]: EventBus} = {};
  private api: RestApi;
  private authorizer: CognitoUserPoolsAuthorizer;

  //constructor:
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.initAppResources();
  }

  //methods:
  private initAppResources() {
    this.initAppTables();
    this.initAppBuckets();
    this.initAppPolicyStatements();
    this.initAppLambdas();
    this.initAppBuses();
    this.initAppApiGateway();
    this.initAppAuthorizer();
    this.attachLambdasToApi()
  }

  private initAppTables() {
    this.tables = initializeTables(this);
  }

  private initAppBuckets() {
    this.buckets = initializeBuckets(this, {bucketAccessTag: this.bucketAccessTag});
  }

  private initAppPolicyStatements() {
    this.policyStatements = initializePolicyStatements({buckets: this.buckets})
  }

  getBusesData() {
    return {
      deleteImagesBus: {
        source: this.deleteImagesBusSource, 
        detailType: this.deleteImagesBusDetailType,
        busName: this.deleteImagesEventBusName,
        ruleName: this.deleteImagesEventBusRuleName
      }
    };
  }

  private initAppLambdas() {
    const appTags = {bucketAccessTag: this.bucketAccessTag};
    const appBusesData = this.getBusesData();
    this.lambdas = initializeLambdas(this, {
      tables: this.tables,
      buckets: this.buckets,
      policyStatements: this.policyStatements,
      tags: appTags,
      eventBusesData: appBusesData
    });
  }

  private initAppBuses() {
    const eventBusData = this.getBusesData().deleteImagesBus;
    this.buses['deleteImagesBus'] = new DeleteImagesEventBus(this, {
      eventBusData: eventBusData, 
      publisherFunctions: [this.lambdas.itemDeleteLambda, this.lambdas.itemUpdateLambda],
      targetFunction: this.lambdas.deleteImagesLambda
    }).bus;
  }

  private initAppApiGateway() {
    this.api = new Api(this).api;
  }

  private initAppAuthorizer() { 
    this.authorizer = new Authorizer(this, {api: this.api}).authorizer;
  }

  private attachLambdasToApi() {
    attachLambdasToApi({api: this.api, lambdas: this.lambdas, authorizer: this.authorizer});
  }

}