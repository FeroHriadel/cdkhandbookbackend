import { Stack } from "aws-cdk-lib";
import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { EventBusData } from "../../models";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";



interface DeleteImagesEventBusProps {
    eventBusData: EventBusData;
    publisherFunctions: NodejsFunction[];
    targetFunction: NodejsFunction;
}



export class DeleteImagesEventBus {

    public bus: EventBus;
    private rule: Rule;
    private stack: Stack;
    private source: string[];
    private detailType: string[];
    private busName: string;
    private ruleName: string;
    private publisherFunctions: NodejsFunction[];
    private targetFunction: NodejsFunction;


    constructor(stack: Stack, props: DeleteImagesEventBusProps) {
        this.stack = stack;
        this.source = props.eventBusData.source;
        this.detailType = props.eventBusData.detailType;
        this.busName = props.eventBusData.busName;
        this.ruleName = props.eventBusData.ruleName;
        this.publisherFunctions = props.publisherFunctions;
        this.targetFunction = props.targetFunction;
        this.initialize();
    }


    private initialize() {
        this.createBus();
        this.createBusRule();
        this.addInvokePermission();
        this.addBusRuleTarget();
        this.grantPutEventsToPublishers();
    }

    private createBus() {
        this.bus = new EventBus(this.stack, this.busName, {eventBusName: this.busName});
    }

    private createBusRule() {
        this.rule = new Rule(this.stack, this.ruleName, {
            eventBus: this.bus,
            enabled: true,
            description: 'Delete ImagesBucket objects',
            eventPattern: {
                source: this.source,
                detailType: this.detailType,
            },
            ruleName: this.ruleName
        });
    }

    private addInvokePermission() {
        this.targetFunction.addPermission('AllowEventBridgeInvoke', {
          principal: new ServicePrincipal('events.amazonaws.com'),
          sourceArn: this.stack.formatArn({
            service: 'events',
            resource: 'rule',
            resourceName: this.busName
          }),
        });
    }

    private addBusRuleTarget() {
        this.rule.addTarget(new LambdaFunction(this.targetFunction));
    }

    private grantPutEventsToPublisher(publisherFn: NodejsFunction) {
        this.bus.grantPutEventsTo(publisherFn);
    }

    private grantPutEventsToPublishers() {
        this.publisherFunctions.forEach(publisherFn => this.grantPutEventsToPublisher(publisherFn));
    }
}