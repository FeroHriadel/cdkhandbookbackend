import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { res, ResponseError } from '../utils';
import { getTagById, getAllTags} from '../dbOperations';



export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        if (event.queryStringParameters?.id) {
            const id = event.queryStringParameters.id;
            const tag = await getTagById(id);
            return res(200,tag);
        } else {
            const allTags = await getAllTags();
            return res(200, allTags);
        }

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