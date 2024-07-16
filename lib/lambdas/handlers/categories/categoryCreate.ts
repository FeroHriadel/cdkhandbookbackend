import { v4 } from 'uuid';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'; 
import { res, ResponseError, checkRequiredKeys, adminOnly } from '../utils';
import { CategoriesTableFields } from '../../../../models';
import { getCategoryByName, saveCategory } from '../dbOperations';



function createCategory(name: string, description: string, image: string) {
    const category: CategoriesTableFields = {
        id: v4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name,
        description: description || '',
        image: image || '',
        type: '#CATEGORY'
    };
    return category;
}



export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        adminOnly(event);
        const body = JSON.parse(event.body!);

        checkRequiredKeys(body, ['name']);
        const nameExists = await getCategoryByName(body.name);
        if (nameExists) throw new ResponseError(403, 'Category with such name already exists'); 

        const categoryToSave = createCategory(body.name, body.description, body.image);
        const saveCategoryResponse = await saveCategory(categoryToSave);
        if (!saveCategoryResponse) throw new ResponseError(500, 'Category was not saved.');
        
        return res(201, categoryToSave);

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

