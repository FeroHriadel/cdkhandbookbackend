import { v4 } from 'uuid';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'; 
import { res, log, ResponseError, checkRequiredKeys } from '../utils';
import { ItemsTableFields } from '../../../../models';
import { getItemByName, saveItem } from '../dbOperations';



function createItem(props: {[key: string]: any}) {
    const { name, description, category, tags, images, createdBy } = props;
    const item: ItemsTableFields = {
        id: v4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: createdBy || 'unknown',
        type: '#ITEM',
        namesearch: name.toLowerCase(),
        name,
        description: description || '',
        category: category || '',
        tags: tags || [],
        images: images || []
    };
    return item;
}



export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        log('event: ', event);
        const body = JSON.parse(event.body!);

        checkRequiredKeys(body, ['name']);
        const nameExists = await getItemByName(body.name);
        if (nameExists) throw new ResponseError(403, 'Item with such name already exists'); 

        const userEmail = event?.requestContext?.authorizer?.claims['email'];
        const itemToSave = createItem({...body, createdBy: userEmail});
        const saveItemResponse = await saveItem(itemToSave);
        if (!saveItemResponse) throw new ResponseError(500, 'Item was not saved.');
        
        return res(201, itemToSave);

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

