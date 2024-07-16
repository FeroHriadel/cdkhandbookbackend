
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { adminOnly, res, ResponseError } from '../utils';
import { getItemById, deleteItem } from "../dbOperations";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge"



const eventBridgeClient = new EventBridgeClient({region: process.env.REGION});



function getImageKey(url: string) {
    const key = url.split('.com/')[1];
    return key;
}

function getItemImages(imagesArr: string[]) {
    const images: {[key: string]: any} = {};
    imagesArr.forEach((image, index) => {
        images[`image${index + 1}`] = getImageKey(image);
    });
    return images; // {image1: '2024-06VFPrasnica.jpg65817.png', image2: '2024-06VFPrasnica2.jpg47097.png', ...}
}

function getPutEventParams(itemImages: string[]) {
    const params = {
        Entries: [
            {
                Source: process.env.EVENT_BUS_SOURCE,
                DetailType: process.env.EVENT_BUS_DETAIL_TYPE,
                EventBusName: process.env.EVENT_BUS_NAME,
                Detail: JSON.stringify({images: getItemImages(itemImages)}), //eventBridge cannot do arrays - must be an object
                Resources: []
            }
        ]
    };
    console.log('Event bus params: ', params);
    return params;
}

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        adminOnly(event);
        const id = event.pathParameters?.id;

        const itemExists = await getItemById(id!);
        if (!itemExists) throw new ResponseError(404, 'Item with such id not found');
        
        const deleteItemResponse = await deleteItem(id!);
        if (!deleteItemResponse) throw new ResponseError(500, 'Deletion failed');

        //delete images from s3 using EventBus
        if (itemExists.images) {
            const params = getPutEventParams(itemExists.images);
            const eventBusRes = await eventBridgeClient.send(new PutEventsCommand(params));
            console.log('eventBusRes: ', eventBusRes);
        }

        return res(200, {message: 'Deleted', id});

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