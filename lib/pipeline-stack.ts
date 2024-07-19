import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, ShellStep, CodePipelineSource, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { PipelineStage } from './pipeline/PipelineStage';
import { initializePipeline } from './pipeline/initializePipeline';



export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = initializePipeline(this, {branch: 'dev'});
    const devStage = pipeline.addStage(new PipelineStage(this, 'DevPipelineStage', {stageName: 'Dev'}));
    const prodStage = pipeline.addStage(new PipelineStage(this, 'ProdPipelineStage', {stageName: 'Prod'}));
    prodStage.addPre(new ManualApprovalStep('PromoteToProd'));
  }
}
