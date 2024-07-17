'use client'

import React, { useState } from 'react';
import Container from '@/components/Container';
import { BadgeX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import { handleResetPassword, handleConfirmResetPassword } from '@/utils/cognito';
import Link from 'next/link';



export const dynamic = 'force-dynamic';



const ResetPasswordPage = () => {
  const [values, setValues] = useState({email: '', code: '', newPassword: ''});
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const { toast } = useToast();
  const disabled = loading || emailSent;


  function handleChange (e:React.ChangeEvent<HTMLInputElement>) {
    setValues({...values, [e.target.name]: e.target.value});
  }

  function handleSubmitError(text?: string) {
    toast({description: text || 'Something went wrong'});
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true);
    const res = await handleResetPassword(values.email); if ((res as any).error) return handleSubmitError((res as any).error);
    setEmailSent(true); setLoading(false);
  }

  async function changePassword() {
    setLoading(true);
    const res = await handleConfirmResetPassword({email: values.email, confirmationCode: values.code, newPassword: values.newPassword});
    if (!res.ok) return handleSubmitError();
    setPasswordChanged(true);
  }


  return (
    <Container>
      <div className='flex items-center gap-4 mb-8'>
        <div className='translate-y-1'><BadgeX size={50} /></div>
        <h1 className='leading-none'>Forgot Password</h1>
      </div>

      <Card className='w-[90%] lg:w-[50%] mb-8'>
        <CardHeader> 
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>No worries. Reset it here. Just enter your email address.</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className='w-100'>
            <Label htmlFor='email'>Email</Label>
            <Input type='text' name='email' value={values.email} onChange={handleChange} disabled={disabled} />
            <br />
            <Button type='submit' className='w-[100%]' disabled={disabled}>Submit</Button>
          </form>

          {
            emailSent 
            &&
            <div className='mt-5 w-[100%]'>
              <p className='text-center'>An email with a code was sent on your email. Please enter the code and your new password below:</p>
              <Label htmlFor='code'>Code</Label>
              <Input type='text' name='code' value={values.code} onChange={handleChange} disabled={loading} />
              <br />
              <Label htmlFor='newPassword'>New Password</Label>
              <Input type='text' name='newPassword' value={values.newPassword} onChange={handleChange} disabled={loading} />
              <br />
              <Button className='w-[100%]' disabled={loading} onClick={changePassword} >Submit</Button>
              {
                passwordChanged
                && 
                <div className='w-[100%]'>
                  <p className='text-center mt-5'>Password changed successfully!</p>
                  <Link href='/signin' className='text-center underline'>
                    <p className='text-center'>Click here to sign in</p>
                  </Link>
                </div>
              }
            </div>
          }
        </CardContent>
      </Card>
    </Container>
  )
}

export default ResetPasswordPage