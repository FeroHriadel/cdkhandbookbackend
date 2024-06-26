import { ImagesBucket } from "./ImagesBucket";
import { Stack } from "aws-cdk-lib";



export const initializeBuckets = (stack: Stack, props: {bucketAccessTag: string}) => {
    const imagesBucket = new ImagesBucket(stack, props).bucket;
    return {
        imagesBucket,
    }
}

