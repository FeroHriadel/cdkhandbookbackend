export const apiEndpoint = process.env.NEXT_PUBLIC_API;

const get = async (url: string, idToken?: string) => {
  try {
    const options = {
      headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': `application/json`
      }
    };
    const res = await fetch(apiEndpoint + url, options);
    if (!res.ok) throw new Error(`GET ${apiEndpoint + url} failed`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return {error};
  }
}

const post = async (url: string, idToken: string | null, body: any) => {
  try {
    const options = {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': `application/json`
      },
      body: JSON.stringify(body)
    };
    const res = await fetch(apiEndpoint + url, options);
    if (!res.ok) throw new Error(`POST ${apiEndpoint + url} failed`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return {error};
  }
}

const del = async (url: string, idToken: string | null, body?: any) => {
  try {
    const options = {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': `application/json`
      },
      body: body ? JSON.stringify(body) : ''
    };
    const res = await fetch(apiEndpoint + url, options);
    if (!res.ok) throw new Error(`DELETE ${apiEndpoint + url} failed`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return {error};
  }
}

const put = async (url: string, idToken: string | null, body?: any) => {
  try {
    const options = {
      method: 'PUT',
      headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': `application/json`
      },
      body: body ? JSON.stringify(body) : ''
    };
    const res = await fetch(apiEndpoint + url, options);
    if (!res.ok) throw new Error(`PUT ${apiEndpoint + url} failed`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return {error};
  }
}

export const apiCalls = {
    get,
    post,
    del,
    put
}