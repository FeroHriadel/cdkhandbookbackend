import { BucketAccelerateStatus } from "@aws-sdk/client-s3";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketAccessPolicyStatement } from "./BucketAccessPolicyStatement";



interface InitPolicyStatementsProps {
    buckets: {[key: string]: Bucket};
}



export const initializePolicyStatements = (props: InitPolicyStatementsProps) => {
    const { buckets } = props;
    const bucketAccessStatement = new BucketAccessPolicyStatement(buckets.imagesBucket).policyStatement;
    return {
        bucketAccessStatement,
    };
}