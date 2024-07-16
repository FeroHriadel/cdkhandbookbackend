import { DynamoDB, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient, GetCommand, UpdateCommand, UpdateCommandInput, DeleteCommand, DeleteCommandInput } from "@aws-sdk/lib-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { CategoriesTableFields, TagsTableFields, ItemsTableFields } from '../../../models';
import { ResponseError } from './utils';
import * as dotenv from 'dotenv';
dotenv.config();



const client = new DynamoDB({region: process.env.REGION});
const docClient = DynamoDBDocumentClient.from(client);



interface CategoryUpdateProps {
    id: string;
    image: string | null;
    name: string | null;
    description: string | null;
}



//TAGS:
export async function getTagByName(name: string) {
    const queryParams = {
        TableName: process.env.TABLE_NAME!,
        IndexName: 'name',
        KeyConditionExpression: '#name = :name',
        ExpressionAttributeNames: {'#name': 'name'},
        ExpressionAttributeValues: {':name': name}
    };
    const response = await docClient.send(new QueryCommand(queryParams));
    if (response.Items?.length !== 0 && Array.isArray(response.Items)) return response.Items[0];
    else return false;
}

export async function saveTag(tag: TagsTableFields) {
    const putParams: PutItemCommandInput = {
        TableName: process.env.TABLE_NAME!, 
        Item: marshall(tag), 
    };
    const response = await docClient.send(new PutItemCommand(putParams));
    return response;
}

export async function getAllTags() {
    const queryParams = {
        TableName: process.env.TABLE_NAME!,
        IndexName: 'nameSort',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: {'#type': 'type'},
        ExpressionAttributeValues: {':type': '#TAG'},
        ScanIndexForward: true,
    };
    const response = await docClient.send(new QueryCommand(queryParams));
    if (!response?.Items) throw new ResponseError(500, 'DB query failed');
    return response.Items;
}

export async function getTagById(id: string) {
    const getParams = {
        TableName: process.env.TABLE_NAME!,
        Key: {id},
    }
    const response = await docClient.send(new GetCommand(getParams));
    if (!response.Item) throw new ResponseError(404, 'Tag not found');
    return response.Item;
}

export async function updateTag(id: string, name: string) {
    const updateParams: UpdateCommandInput = {
        TableName: process.env.TABLE_NAME!,
        Key: {id},
        UpdateExpression: 'set #name = :name, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {'#name': 'name', '#updatedAt': 'updatedAt'},
        ExpressionAttributeValues: {':name': name, ':updatedAt': new Date().toISOString()},
        ReturnValues: 'ALL_NEW'
    };
    const response = await docClient.send(new UpdateCommand(updateParams));
    if (!response?.Attributes) throw new ResponseError(500, 'Update failed');
    return response.Attributes;
}

export async function deleteTag(id: string) {
    const deleteParams: DeleteCommandInput = {
        TableName: process.env.TABLE_NAME!,
        Key: {id}
    }
    const response = await docClient.send(new DeleteCommand(deleteParams));
    return response;
}



//CATEGORIES:
export async function getCategoryByName(name: string) {
    const queryParams = {
        TableName: process.env.TABLE_NAME!,
        IndexName: 'name',
        KeyConditionExpression: '#name = :name',
        ExpressionAttributeNames: {'#name': 'name'},
        ExpressionAttributeValues: {':name': name}
    };
    const response = await docClient.send(new QueryCommand(queryParams));
    if (response.Items?.length !== 0 && Array.isArray(response.Items)) return response.Items[0];
    else return false;
}

export async function getCategoryById(id: string) {
    const getParams = {
        TableName: process.env.TABLE_NAME!,
        Key: {id},
    }
    const response = await docClient.send(new GetCommand(getParams));
    if (!response.Item) throw new ResponseError(404, 'Category not found');
    return response.Item;
}

export async function saveCategory(category: CategoriesTableFields) {
    const putParams: PutItemCommandInput = {
        TableName: process.env.TABLE_NAME!, 
        Item: marshall(category), 
    };
    const response = await docClient.send(new PutItemCommand(putParams));
    return response;
}

export async function getAllCategories() {
    const queryParams = {
        TableName: process.env.TABLE_NAME!,
        IndexName: 'nameSort',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: {'#type': 'type'},
        ExpressionAttributeValues: {':type': '#CATEGORY'},
        ScanIndexForward: true,
    };
    const response = await docClient.send(new QueryCommand(queryParams));
    if (!response?.Items) throw new ResponseError(500, 'DB query failed');
    return response.Items;
}

export async function updateCategory(props: CategoryUpdateProps) {
    const updateParams: UpdateCommandInput = {
        TableName: process.env.TABLE_NAME!,
        Key: {id: props.id},
        UpdateExpression: 'set #name = :name, #updatedAt = :updatedAt, #image = :image, #description = :description',
        ExpressionAttributeNames: {'#name': 'name', '#updatedAt': 'updatedAt', '#image': 'image', '#description': 'description'},
        ExpressionAttributeValues: {':name': props.name, ':updatedAt': new Date().toISOString(), ':image': props.image, ':description': props.description},
        ReturnValues: 'ALL_NEW'
    };
    const response = await docClient.send(new UpdateCommand(updateParams));
    if (!response?.Attributes) throw new ResponseError(500, 'Update failed');
    return response.Attributes;
}

export async function deleteCategory(id: string) {
    const deleteParams: DeleteCommandInput = {
        TableName: process.env.TABLE_NAME!,
        Key: {id}
    }
    const response = await docClient.send(new DeleteCommand(deleteParams));
    return response;
}



//ITEMS
export async function saveItem(item: ItemsTableFields) {
    const putParams: PutItemCommandInput = {
        TableName: process.env.TABLE_NAME!, 
        Item: marshall({...item}),
    };
    const response = await docClient.send(new PutItemCommand(putParams));
    return response;
}

export async function getItemByName(name: string) {
    const queryParams = {
        TableName: process.env.TABLE_NAME!,
        IndexName: 'name',
        KeyConditionExpression: '#name = :name',
        ExpressionAttributeNames: {'#name': 'name'},
        ExpressionAttributeValues: {':name': name}
    };
    const response = await docClient.send(new QueryCommand(queryParams));
    if (response.Items?.length !== 0 && Array.isArray(response.Items)) return response.Items[0];
    else return false;
}

export async function getAllItems() {
    const queryParams = {
        TableName: process.env.TABLE_NAME!,
        IndexName: 'nameSort',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: {'#type': 'type'},
        ExpressionAttributeValues: {':type': '#ITEM'},
        ScanIndexForward: true,
    };
    const response = await docClient.send(new QueryCommand(queryParams));
    if (!response?.Items) throw new ResponseError(500, 'DB query failed');
    return response.Items;
}

export async function getItemById(id: string) {
    const getParams = {
        TableName: process.env.TABLE_NAME!,
        Key: {id},
    }
    const response = await docClient.send(new GetCommand(getParams));
    if (!response.Item) throw new ResponseError(404, 'Item not found');
    return response.Item;
}

export const getItemsByCategory = async (category: string) => {
    const params = {
        TableName: process.env.TABLE_NAME!,
        IndexName: 'nameSort',
        FilterExpression: `contains(#category, :category)`,
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: {'#type': 'type', '#category': 'category'},
        ExpressionAttributeValues: {':type': '#ITEM', ':category': category},
        ScanIndexForward: true,
    };
    const response = await docClient.send(new QueryCommand(params));
    return response.Items;
}

export const getItemsByTag = async (tag: string) => {
    const params = {
        TableName: process.env.TABLE_NAME!,
        IndexName: 'nameSort',
        FilterExpression: `contains(#tags, :tag)`,
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: {'#type': 'type', '#tags': 'tags'},
        ExpressionAttributeValues: {':type': '#ITEM', ':tag': tag},
        ScanIndexForward: true,
    };
    const response = await docClient.send(new QueryCommand(params));
    return response.Items;
}

export const getItemsByCreatedBy = async (createdBy: string) => {
    const params = {
        TableName: process.env.TABLE_NAME!,
        IndexName: 'nameSort',
        FilterExpression: `contains(#createdBy, :createdBy)`,
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: {'#type': 'type', '#createdBy': 'createdBy'},
        ExpressionAttributeValues: {':type': '#ITEM', ':createdBy': createdBy},
        ScanIndexForward: true,
    };
    const response = await docClient.send(new QueryCommand(params));
    return response.Items;
}

export const getItemsByCategoryAndTag = async (category: string, tag: string) => {
    console.log('getting items by category AND tag...');
    const params = {
        TableName: process.env.TABLE_NAME!,
        IndexName: 'nameSort',
        KeyConditionExpression: '#type = :type',
        FilterExpression: `contains(#tags, :tag) AND #category = :category`,
        ExpressionAttributeNames: {'#type': 'type', '#tags': 'tags', '#category': 'category'},
        ExpressionAttributeValues: {':type': '#ITEM', ':tag': tag, ':category': category},
        ScanIndexForward: true,
    };
    const response = await docClient.send(new QueryCommand(params));
    return response.Items;
}

export const getItemsOrderedByDate = async (order: string, category: string | null, tag: string | null) => {
    let params: any = {
        TableName: process.env.TABLE_NAME!,
        IndexName: 'dateSort',
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: {'#type': 'type'},
        ExpressionAttributeValues: {':type': '#ITEM'},
        ScanIndexForward: order === "latest" ? false : true
    }

    if (category && !tag) {
        params.FilterExpression = `contains(#category, :category)`,
        params.KeyConditionExpression = '#type = :type',
        params.ExpressionAttributeNames = {'#type': 'type', '#category': 'category'},
        params.ExpressionAttributeValues = {':type': '#ITEM', ':category': category}
    } 
    else if (!category && tag) {
        params.FilterExpression = `contains(#tags, :tag)`,
        params.KeyConditionExpression = '#type = :type',
        params.ExpressionAttributeNames = {'#type': 'type', '#tags': 'tags'},
        params.ExpressionAttributeValues = {':type': '#ITEM', ':tag': tag}
    }
    else if (category && tag) {
        params.FilterExpression = `contains(#tags, :tag) AND #category = :category`,
        params.KeyConditionExpression = '#type = :type',
        params.ExpressionAttributeNames = {'#type': 'type', '#tags': 'tags', '#category': 'category'},
        params.ExpressionAttributeValues = {':type': '#ITEM', ':tag': tag, ':category': category}
    }
    const response = await docClient.send(new QueryCommand(params));
    return response.Items;
}

export const getItemsWhereNameIncludes = async (namesearch: string) => {
    console.log(`searching items where name includes ${namesearch}`);
    const params = {
        TableName: process.env.TABLE_NAME!,
        IndexName: 'nameSort',
        FilterExpression: `contains(#namesearch, :namesearch)`,
        KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: {'#type': 'type', '#namesearch': 'namesearch'},
        ExpressionAttributeValues: {':type': '#ITEM', ':namesearch': namesearch},
        ScanIndexForward: true,
    }
    const response = await docClient.send(new QueryCommand(params));
    return response.Items;
}

export async function updateItem(props: ItemsTableFields) {
    const updateParams: UpdateCommandInput = {
        TableName: process.env.TABLE_NAME!,
        Key: {id: props.id},
        UpdateExpression: `set 
            #name = :name, 
            #namesearch = :namesearch, 
            #updatedAt = :updatedAt, 
            #images = :images, 
            #description = :description, 
            #category = :category, 
            #tags = :tags`,
        ExpressionAttributeNames: {
            '#name': 'name', 
            '#namesearch': 'namesearch', 
            '#updatedAt': 'updatedAt', 
            '#images': 'images', 
            '#description': 'description',
            '#category': 'category',
            '#tags': 'tags'
        },
        ExpressionAttributeValues: {
            ':name': props.name, 
            ':namesearch': props.namesearch,
            ':updatedAt': props.updatedAt, 
            ':images': props.images, 
            ':description': props.description,
            ':category': props.category,
            ':tags': props.tags
        },
        ReturnValues: 'ALL_NEW'
    };
    const response = await docClient.send(new UpdateCommand(updateParams));
    if (!response?.Attributes) throw new ResponseError(500, 'Update failed');
    return response.Attributes;
}

export async function deleteItem(id: string) {
    const deleteParams: DeleteCommandInput = {
        TableName: process.env.TABLE_NAME!,
        Key: {id}
    }
    const response = await docClient.send(new DeleteCommand(deleteParams));
    return response;
}