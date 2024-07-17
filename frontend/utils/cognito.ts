// https://docs.amplify.aws/gen1/javascript/build-a-backend/auth/enable-sign-up/
// https://docs.amplify.aws/gen1/javascript/build-a-backend/auth/manage-user-session/

import { Amplify } from "aws-amplify";
import { amplifyConfig } from "@/amplifyConfig";
import { signUp, confirmSignUp, signIn, signOut, fetchAuthSession, resetPassword, type ResetPasswordOutput, confirmResetPassword } from "aws-amplify/auth";



Amplify.configure(amplifyConfig);



export const cognitoSignup = async (email: string, password: string) => {
  try {
    const res = await signUp({username: email, password});
    if (!res) throw new Error('No response from Cognito');
    const { isSignUpComplete, userId, nextStep } = res;
    return {error: false}
  } catch (error) {
    console.log(error);
    let er = JSON.parse(JSON.stringify(error)).name || 'Sign up failed';
    return {error: er};
  }
}

export const confirmCognitoSignup = async (email: string, confirmationCode: string) => {
  try {
    const res = await confirmSignUp({username: email, confirmationCode});
    if (!res) throw new Error('No response from Cognito');
    const { isSignUpComplete, nextStep } = res;
    return {error: false};
  } catch (error) {
    console.log(error);
    let er = JSON.parse(JSON.stringify(error)).name || 'Sign up confirmation failed';
    return {error: er};
  }
}

export const cognitoSignin = async (username: string, password: string) => {
  try {
    const { isSignedIn, nextStep } = await signIn({username, password});
    return { isSignedIn, nextStep };
  } catch (error) {
    console.log(error);
    let er = JSON.parse(JSON.stringify(error)).name || 'Sign in failed';
    return {error: er};
  }
}

export const cognitoSignout = async () => {
  try {
    await signOut();
  } catch (error) {
    console.log(error);
    let er = JSON.parse(JSON.stringify(error)).name || 'Sign out failed';
    return {error: er};
  }
}

export const getCognitoSession = async () => {
  try {
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {}
    if (!idToken) throw new Error('No session');
    return {accessToken, idToken};
  } catch (error) {
    console.log(error);
    let er = JSON.parse(JSON.stringify(error)).name || 'Getting session failed';
    return {error: er};
  }
}

export const refreshCognitoSession = async () => {
  try {
    const { tokens } = await fetchAuthSession({forceRefresh: true});
    return {tokens};
  } catch (error) {
    console.log(error);
    let er = JSON.parse(JSON.stringify(error)).name || 'Refreshing session failed';
    return {error: er};
  }
}

export const handleResetPassword = async(email: string) => {
  try {
    const output = await resetPassword({ username: email });
    return output;
  } catch (error) {
    console.log(error);
    let er = JSON.parse(JSON.stringify(error)).name || 'Resetting password failed';
    return {error: er};
  }
}

export const handleConfirmResetPassword = async (props: {email: string, confirmationCode: string, newPassword: string}) => {
  try {
    const { email, confirmationCode, newPassword } = props;
    await confirmResetPassword({ username: email, confirmationCode: confirmationCode, newPassword: newPassword});
    return {ok: true}
  } catch (error) {
    let er = JSON.parse(JSON.stringify(error)).name || 'Resetting password failed';
    return {error: er};
  }
}
