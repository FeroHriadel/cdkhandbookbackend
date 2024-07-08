'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import { useState } from 'react'
import { PackagePlus } from 'lucide-react';
import { apiCalls } from '@/utils/apiCalls';
import { Tag } from '@/models/models';
import { useAppDispatch } from '@/redux/store';
import { addTag } from '@/redux/slices/tagsSlice';
import Container from '@/components/Container';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';



export const dynamic = 'force-dynamic';



const AddTagPage = () => {
  const [name, setName] = useState('');
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuth(); const { idToken } = user;


  const saveTagToDB = async (name: string) => {
    const url = '/tags';  const body = {name}
    const res = await apiCalls.post(url, idToken, body);
      if (res.id) { toast({description: 'Tag saved'}); return res }
      else { toast({description: 'Saving tag failed'}); return {error: true} }
  }

  const addTagToState = (tag: Tag) => dispatch(addTag(tag));

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      if (!name) return toast({description: 'Name is required'});
    const saved = await saveTagToDB(name);
      if (saved.error) return
    addTagToState(saved); setName(''); router.push('/admin/tags');
  }


  return (
    <Container>
      <div className='flex items-center gap-4 mb-8'>
        <div className='translate-y-1'><PackagePlus size={50} /></div>
        <h1 className='leading-none'>Add Tag</h1>
      </div>

      <Card className='w-[100%] md:w-[50%]'>
        <CardHeader> 
          <CardTitle>Add Tag</CardTitle>
          <CardDescription>Create a new tag</CardDescription>
          </CardHeader>
        
          <CardContent>
            <form onSubmit={handleSubmit} className='w-100'>
              <Label htmlFor='name'>Tag name</Label>
              <Input type='text' name='text' value={name} onChange={handleChange} />
              <br />
              <Button type='submit' className='w-[100%]'>Submit</Button>
            </form>
          </CardContent>
        </Card>
      </Container>
  )
}

export default AddTagPage