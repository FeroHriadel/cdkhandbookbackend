import * as cdk from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';



/******************************************************************
 * TagsTable attributes: 
 *    id, createdAt, updatedAt, name, type.
 * Tags retrieval: 
 *    1) search tag by name 
 *    2) all tags can be retrieved sorted alphabetically by name
******************************************************************/



export class TagsTable {
    private stack: cdk.Stack;
    public table: Table

    public constructor(stack: cdk.Stack) {
        this.stack = stack;
        this.initTable();
    }



    private initTable() {
        this.createTable();
        this.addSecondaryIndexes();
    }

    private createTable() {
        this.table = new Table(this.stack, this.stack.stackName + 'TagsTable', {
            tableName: this.stack.stackName + 'TagsTable',
            partitionKey: {name: 'id', type: AttributeType.STRING},
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        });
    }

    private addSecondaryIndexes() {
        //so we can search tags by name:
        this.table.addGlobalSecondaryIndex({
            indexName: 'name',
            partitionKey: {name: 'name', type: AttributeType.STRING}
        });
        //so we can get all tags ordered by name
        //this will be a composite key (key with PK and SK)
        this.table.addGlobalSecondaryIndex({ 
            indexName: 'nameSort',
            partitionKey: {name: 'type', type: AttributeType.STRING},
            sortKey: {name: 'name', type: AttributeType.STRING}
        });
        //All tags will have an attribute `type: #TAG`.
        //When making a query to get all tags sorted by name we specify an equality condition.
        //The equality condition will be: `:tag = '#TAG'` (which all tags have).
        //This will return all tags ordered by `name` (`ScanIndexForward: true` in a query will do that).
    }
}