//https://docs.amplify.aws/gen1/javascript/tools/libraries/configure-categories/



export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: process.env.NEXT_PUBLIC_USERPOOL_CLIENT_ID!,
      userPoolId: process.env.NEXT_PUBLIC_USERPOOL_ID!
    }
  }
};