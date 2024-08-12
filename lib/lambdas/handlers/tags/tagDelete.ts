
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { adminOnly, res, ResponseError } from '../utils';
import { getTagById, deleteTag } from "../dbOperations";



export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        adminOnly(event);
        const id = event.pathParameters?.id;
        const tagExists = await getTagById(id!);
        if (!tagExists) throw new ResponseError(404, 'Tag with such id not found');
        
        const deleteTagResponse = await deleteTag(id!);
        if (!deleteTagResponse) throw new ResponseError(500, 'Deletion failed');
        return res(200, {message: 'Deleted', id})

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