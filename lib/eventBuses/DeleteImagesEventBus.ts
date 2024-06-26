import { Stack } from "aws-cdk-lib";
import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { EventBusData } from "../../models";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";



interface DeleteImagesEventBusProps {
    eventBusData: EventBusData;
    publisherFunction: NodejsFunction;
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
    private publisherFunction: NodejsFunction;
    private targetFunction: NodejsFunction;


    constructor(stack: Stack, props: DeleteImagesEventBusProps) {
        this.stack = stack;
        this.source = props.eventBusData.source;
        this.detailType = props.eventBusData.detailType;
        this.busName = props.eventBusData.busName;
        this.ruleName = props.eventBusData.ruleName;
        this.publisherFunction = props.publisherFunction;
        this.targetFunction = props.targetFunction;
        this.initialize();
    }


    initialize() {
        this.createBus();
        this.createBusRule();
        this.addInvokePermission();
        this.addBusRuleTarget();
        this.grantPutEventsToPublisher();
    }

    createBus() {
        this.bus = new EventBus(this.stack, this.busName, {eventBusName: this.busName});
    }

    createBusRule() {
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

    addInvokePermission() {
        this.targetFunction.addPermission('AllowEventBridgeInvoke', {
          principal: new ServicePrincipal('events.amazonaws.com'),
          sourceArn: this.stack.formatArn({
            service: 'events',
            resource: 'rule',
            resourceName: this.busName
          }),
        });
    }

    addBusRuleTarget() {
        this.rule.addTarget(new LambdaFunction(this.targetFunction));
    }

    grantPutEventsToPublisher() {
        this.bus.grantPutEventsTo(this.publisherFunction);
    }
}