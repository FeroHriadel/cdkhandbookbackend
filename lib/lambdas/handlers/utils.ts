import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ItemsTableFields } from "../../../models";




export function res(statusCode: number, body: {[key: string]: any} | any[]) {
    const response: APIGatewayProxyResult = {
        statusCode: statusCode || 500,
        headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': '*'},
        body: JSON.stringify(body) || JSON.stringify({error: 'No operation ran'})
    };
    log('Responding: ', response);
    return response;
}

export function log(item1: any, item2?: any) {
    if (!item2) console.log(item1);
    else console.log(item1, item2);
}

export function checkRequiredKeys(object: {[key: string]: any}, requiredKeys: string[]) {
    requiredKeys.forEach(key => {
        if (!object[key]) throw new ResponseError(400, `No ${key} found`);
    })
}

function checkArrayItems(array: any[], type: string) {
    array.forEach(item => {
        if (typeof item !== type) throw new ResponseError(400 || 500, 'Wrong array item type');
    })
}

export function checkItem(obj: ItemsTableFields) {
    if (obj.name && typeof obj.name !== 'string') throw new ResponseError(400, 'name must be a string');
    if (obj.images && !Array.isArray(obj.images)) throw new ResponseError(400, 'images must be an array of strings');
    if (obj.description && typeof obj.description !== 'string') throw new ResponseError(400, 'description must be a string');
    if (obj.category && typeof obj.category !== 'string') throw new ResponseError(400, 'category must be a string');
    if (obj.tags && !Array.isArray(obj.tags)) throw new ResponseError(400, 'tags must be an array of strings');
    if (obj.images && obj.images.length) checkArrayItems(obj.images!, 'string');
    if (obj.tags && obj.tags.length) checkArrayItems(obj.tags!, 'string');
}

export class ResponseError extends Error {
    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

export function isAdmin(event: APIGatewayProxyEvent) {
    const isAdmin = event?.requestContext?.authorizer?.claims['cognito:groups'] === 'admin';
    return isAdmin;
}

export function getUserEmail(event: APIGatewayProxyEvent) {
    const userEmail = event?.requestContext?.authorizer?.claims['email'];
    return userEmail;
}

export function adminOnly(event: APIGatewayProxyEvent) {
    const isUserAdmin = isAdmin(event);
    console.log('is user admin: ', isAdmin);
    if (!isUserAdmin) throw new ResponseError(403, 'Admin access required');
}

