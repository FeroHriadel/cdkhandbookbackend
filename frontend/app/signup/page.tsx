'use client'

// https://docs.amplify.aws/gen1/javascript/build-a-backend/auth/enable-sign-up/



import { useState} from 'react'
import { cognitoSignup, confirmCognitoSignup } from '@/utils/cognito';
import { LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import Container from '@/components/Container';
import Link from 'next/link';



const SignupPage = () => {
  const [values, setValues] = useState({email: '', password: ''});
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [successfulConfirm, setSuccessfulConfirm] = useState(false);
  const { toast } = useToast();
  

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setValues({...values, [e.target.name]: e.target.value});
  }

  const handleSignupError = (error: string) => {
    toast({description: error});
    setSignupLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setSignupLoading(true);
    const res = await cognitoSignup(values.email.toLowerCase(), values.password);
    if (res.error) return handleSignupError(res.error);
    setShowCode(true);
  }

  const handleSigupConfirmError = (error: string) => {
    toast({description: error})
    setCodeLoading(false);
  }

  const handleSignupConfirm = async () => {
    if (!code) return toast({description: 'Please enter the code from your email'});
    setCodeLoading(true);
    const res = await confirmCognitoSignup(values.email, code);
    if (res.error) return handleSigupConfirmError('Something went wrong');
    setSuccessfulConfirm(true);
  }
  

  return (
    <Container>
      <div className='flex items-center gap-4 mb-8'>
        <div className='translate-y-1'><LogIn size={50} /></div>
        <h1 className='leading-none'>Sign up</h1>
      </div>
      
      <Card className='w-[90%] lg:w-[50%] mb-8'>
        <CardHeader> 
          <CardTitle>Register</CardTitle>
          <CardDescription>Register so you can add your own items</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className='w-100'>
            <Label htmlFor='email'>Email</Label>
            <Input type='text' name='email' value={values.email} onChange={handleChange} disabled={signupLoading} />
            <br />
            <Label htmlFor='password'>Password</Label>
            <Input type='password' name='password' value={values.password} onChange={handleChange} disabled={signupLoading} />
            <br />
            <Button type='submit' className='w-[100%]' disabled={signupLoading}>Submit</Button>
          </form>

          {
            showCode
            &&
            <div className='w-100'>
              <br /><hr /><br />
              <p className='text-orange-700'>We sent you an email with a code. Please paste the code and click 'Complete Registration'</p>
              <br />
              <Label htmlFor='code'>Code</Label>
              <Input type='text' name='code' value={code} placeholder='Enter the code from your email here' onChange={(e) => setCode(e.target.value)} disabled={codeLoading} />
              <Button className='w-[100%] mt-3' disabled={codeLoading} onClick={handleSignupConfirm}>Complete Registration</Button>
              {
                successfulConfirm
                &&
                <div className="w-100">
                  <br /><hr /><br />
                  <Link href='signin'> <p className='text-orange-700 hover:text-orange-600 text-center'>Registration complete! You may now <u>sign in!</u></p> </Link>
                  <br />
                </div>
              }
            </div>
          }
        </CardContent>
      </Card>
    </Container>
  )
}

export default SignupPage