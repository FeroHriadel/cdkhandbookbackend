import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { checkItem, getUserEmail, isAdmin, res, ResponseError } from '../utils';
import { getItemByName, getItemById, updateItem } from "../dbOperations";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge"



const eventBridgeClient = new EventBridgeClient({region: process.env.REGION});



function getUnusedImages(oldImages: string[], newImages: string[]) {
    const imagesToDelete = oldImages.filter(image => !newImages.includes(image));
    return imagesToDelete;
}

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
        const id = event.pathParameters?.id;
        const itemExists = await getItemById(id!);
        if (!itemExists) throw new ResponseError(404, 'Item with such id not found');

        const userEmail = getUserEmail(event);
        const isUserAdmin = isAdmin(event);
        if (!isUserAdmin) {
            if (itemExists.createdBy !== userEmail) throw new ResponseError(403, 'You are not allowed to update this item');
        }

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

        let imagesToDelete: string[] = getUnusedImages(itemExists.images, itemToUpdate.images);
        if (imagesToDelete.length) {
            console.log('imagesToDelete: ', imagesToDelete);
            const params = getPutEventParams(imagesToDelete);
            console.log('bus params: ', params)
            const eventBusRes = await eventBridgeClient.send(new PutEventsCommand(params));
            console.log('eventBusRes: ', eventBusRes);
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