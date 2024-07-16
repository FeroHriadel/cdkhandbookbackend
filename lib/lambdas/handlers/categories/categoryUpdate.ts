import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { adminOnly, res, ResponseError } from '../utils';
import { getCategoryByName, getCategoryById, updateCategory } from "../dbOperations";
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';



const client = new S3Client({region: process.env.REGION});



async function deleteOldImage(objectUrl: string) {
    const objectKey = objectUrl.split('/').pop();
    const deleteImgRes = await client.send(new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: objectKey!
    }));
    console.log('deleteImgRes', deleteImgRes);
}



export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        adminOnly(event);
        const body = JSON.parse(event.body!);
        const id = event.pathParameters?.id;
        if (!id) throw new ResponseError(400, 'id is required');

        const categoryExists = await getCategoryById(id);
        if (!categoryExists) throw new ResponseError(404, 'Category with such id not found');

        if (body.name) {
            const nameExists = await getCategoryByName(body.name);
            if (nameExists && nameExists.id !== id) throw new ResponseError(403, 'Category with such name already exists'); 
        }

        if (categoryExists.image && (categoryExists.image !== body.image as string)) await deleteOldImage(categoryExists.image);
          
        const attributesToUpdate = {...categoryExists, ...body, id}
        const updatedCategory = await updateCategory(attributesToUpdate);
        return res(200, updatedCategory);

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