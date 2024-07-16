import { v4 } from 'uuid';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'; 
import { res, log, ResponseError, checkRequiredKeys, adminOnly } from '../utils';
import { TagsTableFields } from '../../../../models';
import { getTagByName, saveTag } from '../dbOperations';



function createTag(name: string) {
    const tag: TagsTableFields = {
        id: v4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: name,
        type: '#TAG'
    };
    return tag;
}



export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        adminOnly(event);
        const body = JSON.parse(event.body!);

        checkRequiredKeys(body, ['name']);
        const nameExists = await getTagByName(body.name);
        if (nameExists) throw new ResponseError(403, 'Tags with such name already exists'); 

        const tagToSave = createTag(body.name);
        const saveTagResponse = await saveTag(tagToSave);
        if (!saveTagResponse) throw new ResponseError(500, 'Tag was not saved.');
        
        return res(201, tagToSave);

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

