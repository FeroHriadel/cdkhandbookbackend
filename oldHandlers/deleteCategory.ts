
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { res, ResponseError } from './utils';
import { getCategoryById, deleteCategory } from "./dbOperations";
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';



const client = new S3Client({region: process.env.REGION});



export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        const id = event.pathParameters?.id;

        const categoryExists = await getCategoryById(id!);
        if (!categoryExists?.id) throw new ResponseError(404, 'Category with such id not found');
        
        const deleteCategoryResponse = await deleteCategory(id!);
        if (!deleteCategoryResponse) throw new ResponseError(500, 'Deletion failed');

        if (categoryExists.image) {
            const Key = categoryExists.image.split('.com/')[1];
            const Bucket = process.env.BUCKET_NAME!;
            const command = new DeleteObjectCommand({Key, Bucket});
            const deleteImgRes = await client.send(command);
            console.log(deleteImgRes);
        }

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