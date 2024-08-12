import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
dotenv.config();



const repo = process.env.GITHUB_REPO_NAME || 'repoUNDEFINED!';



export function initializePipeline(scope: Construct, props: {branch: string}) {
  const pipeline = new CodePipeline(scope, process.env.APP_NAME + 'Pipeline', {
    pipelineName: process.env.APP_NAME + 'Pipeline',
    synth: new ShellStep('Synth', {
      input: CodePipelineSource.gitHub(repo, props.branch),
      commands: [
        'npm ci',
        'npx cdk synth'
      ]
    })
  });
  return pipeline;
}