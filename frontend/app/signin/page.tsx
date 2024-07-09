'use client'

// https://docs.amplify.aws/gen1/javascript/build-a-backend/auth/manage-user-session/

import { useEffect, useState } from 'react'
import { cognitoSignin, getCognitoSession, cognitoSignout } from '@/utils/cognito';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import { KeyRound } from 'lucide-react';
import Container from '@/components/Container';
import Link from 'next/link';
import { useAuth } from "@/context/authContext";
import { useRouter } from 'next/navigation'



export const dynamic = 'force-dynamic';



const SigninPage = () => {
  const [values, setValues] = useState({email: '', password: ''});
  const { email, password } = values;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, setUser, getUserFromSession } = useAuth();
  const router = useRouter();


  const redirectHome = (msDelay: number) => {
    setTimeout(() => {
      router.push('/');
    }, msDelay);
  }

  const handleSigninError = (error: string) => {
    toast({description: error});
    setLoading(false);
  }

  const createSession = async (idToken: string) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({idToken})
    };
    const url = process.env.NEXT_PUBLIC_NEXT_API + '/createsession';
    const res = await fetch(url, options); if (!res.ok) return {error: 'Got no response'};
    const data = await res.json(); if (data.error) return {error: data.error};
    return data;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault(); setLoading(true);
    const res = await cognitoSignin(email.toLowerCase(), password); if (res.error) return handleSigninError(res.error);
    const session = await getCognitoSession(); if (session.error) return handleSigninError(res.error);
    const { isAdmin, email: userEmail, expires, idToken } = getUserFromSession(session);
    setUser({isAdmin, email: userEmail, expires: expires, idToken: idToken});
    toast({description: `You're now signed in`});    
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setValues({...values, [e.target.name]: e.target.value});
  }


  useEffect(() => {
    if (user?.email) redirectHome(1000);
  }, [user]);


  return (
    <Container>

      <div className='flex items-center gap-4 mb-8'>
        <div className='translate-y-1'><KeyRound size={50} /></div>
        <h1 className='leading-none'>Sign in</h1>
      </div>
      
      <Card className='w-[90%] lg:w-[50%] mb-8'>
        <CardHeader> 
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Log in to your account</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className='w-100'>
            <Label htmlFor='email'>Email</Label>
            <Input type='text' name='email' value={values.email} onChange={handleChange} disabled={loading} />
            <br />
            <Label htmlFor='password'>Password</Label>
            <Input type='password' name='password' value={values.password} onChange={handleChange} disabled={loading} />
            <br />
            <Button type='submit' className='w-[100%]' disabled={loading}>Submit</Button>
          </form>
        </CardContent>

        <CardFooter className='flex flex-col'>
            <p>
                Don't have an account?
                {' '}
                <span className='text-slate-500 hover:text-slate-600'>
                  <Link href='/signup'>Sign up</Link> 
                </span>
            </p>
            <p>
                Forgot password?
                {' '}
                <span className='text-slate-500 hover:text-slate-600'>
                  <Link href='/forgotpassword'>Forgot Password</Link> 
                </span>
            </p>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default SigninPage