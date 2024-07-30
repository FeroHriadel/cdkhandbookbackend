import { Table } from "aws-cdk-lib/aws-dynamodb";
import { AppTables, AppBuckets, AppPolicyStatements, AppLambdas } from "../../models";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Stack, Tags } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { Policy, ServicePrincipal } from "aws-cdk-lib/aws-iam";


interface EventBusData {
    source: string[];
    detailType: string[];
    busName: string;
    ruleName: string;
}

interface AppLambdaProps {
    lambdaName: string;
    folder: string;
    table?: Table;
    tableWriteRights?: boolean;
    bucket?: Bucket;
    policyStatements?: AppPolicyStatements;
    tags?: {[key: string]: string};
    eventBusData?: EventBusData;
}



export class AppLambda {

  private stack: Stack;
  private lambdaName: string;
  private folder: string;
  private table: Table;
  private tableWriteRights: boolean;
  private bucket: Bucket;
  private policyStatements: AppPolicyStatements;
  private eventBusData: EventBusData;
  private tags: {[key: string]: string};
  public lambda: NodejsFunction;


  constructor(stack: Stack, props: AppLambdaProps) {
    const { lambdaName, folder, table, tableWriteRights, bucket, eventBusData, policyStatements, tags } = props;
    this.stack = stack;
    this.lambdaName = lambdaName;
    this.folder = folder;
    if (table) this.table = table;
    if (tableWriteRights) this.tableWriteRights = tableWriteRights;
    if (bucket) this.bucket = bucket;
    if (policyStatements) this.policyStatements = policyStatements;
    if (eventBusData) this.eventBusData = eventBusData;
    if (tags) this.tags = tags;
    this.initialize();
  }


  private initialize() {
    this.createLambda();
    if (this.table) this.addTableRights();
    if (this.policyStatements) this.addRoles();
    if (this.tags) this.addTags();
    if (this.eventBusData) this.addInvokeEventBusPermission();
  }

  private createLambda = () => {
    this.lambda = new NodejsFunction(this.stack, this.stack.stackName + this.lambdaName, {
      entry: (join(__dirname, 'handlers', this.folder, `${this.lambdaName}.ts`)),
      handler: 'handler',
      functionName: this.stack.stackName + this.lambdaName,
      environment: {
        REGION: process.env.REGION || 'region not defined!',
        TABLE_NAME: this.table?.tableName || 'no table defined!',
        BUCKET_NAME: this.bucket?.bucketName || 'no bucket defined!',
        EVENT_BUS_SOURCE: this.eventBusData?.source[0] || 'no event bus source defined!',
        EVENT_BUS_DETAIL_TYPE: this.eventBusData?.detailType[0] || 'no event bus detail type defined!',
        EVENT_BUS_NAME: this.eventBusData?.busName || 'no event bus name defined!',
      }
    });
  }

  private addTableRights() {
    if (this.tableWriteRights) this.table.grantReadWriteData(this.lambda);
    else this.table.grantReadData(this.lambda);
  }

  private addRoles() {
    Object.keys(this.policyStatements).forEach((key) => {
        this.lambda.role?.attachInlinePolicy(new Policy(this.stack, `${this.lambdaName}${key}`, {
            statements: [this.policyStatements[key]]
        }));
    })
  }

  private addTags() {
    Object.keys(this.tags).forEach((key) => {
        Tags.of(this.lambda).add(this.tags[key], this.tags[key]);
    });
  }

  private addInvokeEventBusPermission() {
    this.lambda.addPermission(`${this.lambdaName}AllowEventBusInvoke`, {
      principal: new ServicePrincipal('events.amazonaws.com'),
      sourceArn: this.stack.formatArn({
        service: 'events',
        resource: 'rule',
        resourceName: `${this.eventBusData.ruleName}`
      })
    });
  }
}