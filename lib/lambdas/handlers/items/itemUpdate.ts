import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { checkItem, res, ResponseError } from '../../utils';
import { getItemByName, getItemById, updateItem } from "../../dbOperations";



export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        const id = event.pathParameters?.id;
        const itemExists = await getItemById(id!);
        if (!itemExists) throw new ResponseError(404, 'Item with such id not found');

        const body = JSON.parse(event.body!);
        checkItem(body);
        if (body.name) {
            const nameExists = await getItemByName(body.name);
            if (nameExists && nameExists.id !== id) throw new ResponseError(403, 'Item with such name already exists'); 
        }

        const itemToUpdate = {
            name: body.name || itemExists.name,
            namesearch: body.name?.toLowerCase() || itemExists.name.toLowerCase(),
            images: body.images || itemExists.images,
            description: body.description || itemExists.description,
            category: body.category || itemExists.category,
            tags: body.tags || itemExists.tags,
            updatedAt: new Date().toISOString(),
            id
        }

        const updatedItem = await updateItem(itemToUpdate);
        return res(200, updatedItem);

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