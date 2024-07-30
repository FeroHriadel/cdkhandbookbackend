import * as cdk from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';



/******************************************************************
 * ItemsTable attributes: 
 *    id, createdAt, updatedAt, type, namesearch, name, tags, category, images
 * Tags retrieval: 
 *    1) search item by name 
 *    2) all items can be retrieved sorted alphabetically by name
******************************************************************/



export class ItemsTable {
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
        this.table = new Table(this.stack, this.stack.stackName + 'ItemsTable', {
            tableName: this.stack.stackName + 'ItemsTable',
            partitionKey: {name: 'id', type: AttributeType.STRING},
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        });
    }

    private addSecondaryIndexes() {
        //so we can get item by name
        this.table.addGlobalSecondaryIndex({
            indexName: 'name',
            partitionKey: {name: 'name', type: AttributeType.STRING}
        });
        //so we can order items by name
        this.table.addGlobalSecondaryIndex({ //this will be a composite key (with PK and SK)
            indexName: 'nameSort',
            partitionKey: { name: 'type', type: AttributeType.STRING },
            sortKey: { name: 'name', type: AttributeType.STRING }
        }); //all items have `type: #ITEM`. When making a query, you must specify equality condition. But you want all the items! So your condition will be: `:item = '#ITEM` (which all items have) and it will return all items ordered by name (`ScanIndexForward: true` in query will do that)
        
        //so we can order by updatedAt
        this.table.addGlobalSecondaryIndex({ //this will be a composite key (with PK and SK)
            indexName: 'dateSort',
            partitionKey: { name: 'type', type: AttributeType.STRING },
            sortKey: { name: 'updatedAt', type: AttributeType.STRING }
        });

        // //so we can search items by category and order by name (also we can (and will) use nameSort with FilterExpression: contains(#category, :category) so I needn't have bothered here)
        // this.table.addGlobalSecondaryIndex({ //this will be a composite key (with PK and SK)
        //     indexName: 'categorySort',
        //     partitionKey: { name: 'category', type: AttributeType.STRING },
        //     sortKey: { name: 'name', type: AttributeType.STRING }
        // });
    }
}