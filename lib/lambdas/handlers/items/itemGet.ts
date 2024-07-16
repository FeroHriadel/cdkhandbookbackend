import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { res, ResponseError } from '../utils';
import { getItemById, getAllItems, getItemsOrderedByDate, getItemsByCategory, getItemsByTag, getItemsByCategoryAndTag, getItemsWhereNameIncludes, getItemsByCreatedBy } from '../dbOperations';



export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log('lambda triggered')

    try {
        let result = null;
        //get all items
        if (!event.queryStringParameters) {
            result = await getAllItems();
            console.log('getAllItems', result);
        }
        else {
            console.log('found query string params')
            const query = event.queryStringParameters;
            //get by id
            if (query.item) {
                result = await getItemById(query.item);
            }
            //get by creator
            else if (query.createdby) {
                result = await getItemsByCreatedBy(query.createdby);
            }
            //search items by name (name includes - case insensitive)
            else if (query.namesearch) {
                result = await getItemsWhereNameIncludes(query.namesearch.toLowerCase());
            }
            //order by updatedAt
            else if (query.order) {
                result = await getItemsOrderedByDate(query.order, query.category ? query.category : null, query.tag ? query.tag : null);
            }
            //get items by category
            else if (Object.keys(query).length === 1 && query.category) { 
                result = await getItemsByCategory(query.category);
            }
            //get items by tag
            else if (Object.keys(query).length === 1 && query.tag) { 
                result = await getItemsByTag(query.tag);
            }
            //get items by category and tag
            else if (Object.keys(query).length === 2 && query.tag && query.category) { 
                result = await getItemsByCategoryAndTag(query.category, query.tag);
            }
        }
        return res(200, result ? result : {error: 'No result returned'});

    } catch (error) {
        if (error instanceof Error || error instanceof ResponseError) {
            return res(
                (error as ResponseError).statusCode || 500, 
                {error: error.message || 'Something went wrong'}
            );
        }
        return res(500, {error: 'Something went wrong'});
    }
}