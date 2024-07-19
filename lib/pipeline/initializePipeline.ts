import { CodeBuildStep, CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
dotenv.config();



const repo = process.env.GITHUB_REPO_NAME || 'repoUNDEFINED!';



export function initializePipeline(scope: Construct, props: {branch: string}) {
  const pipeline = new CodePipeline(scope, 'CdkHandbookPipeline', {
    pipelineName: 'CdkHandbookPipeline',
    synth: new ShellStep('Synth', {
      //input: CodePipelineSource.gitHub(repo, props.branch),
      input: CodePipelineSource.gitHub('FeroHriadel/cdkhandbookbackend', props.branch),
      commands: [
        'npm ci',
        'npx cdk synth'
      ]
    })
  });
  return pipeline;
}