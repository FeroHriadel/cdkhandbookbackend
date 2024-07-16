import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { adminOnly, res, ResponseError } from '../utils';
import { getTagByName, getTagById, updateTag } from "../dbOperations";



export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        adminOnly(event);
        const id = event.pathParameters?.id;
        const newName = JSON.parse(event.body!).name;
        if (!id || !newName) throw new ResponseError(400, 'id and new name are required');

        const tagExists = await getTagById(id);
        if (!tagExists) throw new ResponseError(404, 'Tag with such id not found');

        const nameExists = await getTagByName(newName);
        if (nameExists) throw new ResponseError(403, 'Tag with such name already exists'); 
        
        const updatedTag = await updateTag(id, newName);
        return res(200, updatedTag);

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