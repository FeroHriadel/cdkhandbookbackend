'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from 'react'
import { PackagePlus } from 'lucide-react';
import { apiCalls } from '@/utils/apiCalls';
import { Tag } from '@/models/models';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { editTag } from '@/redux/slices/tagsSlice';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/Container';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';



export const dynamic = 'force-dynamic';



const EditTagPage = () => {
  const [name, setName] = useState('');
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const tags = useAppSelector(state => state.tags);
  const params = useSearchParams(); 
  const id = params.get('id');
  const { user } = useAuth(); const { idToken } = user;
  const router = useRouter();
  


  const populateForm = () => {
    if (tags.length === 0) return;
    const idx = tags.findIndex((t: Tag) => t.id === id);
    if (idx !== -1) {
      const t = tags[idx];
      setName(t.name);
    }
  }

  const updateTagInDB = async (name: string) => {
    const url = `/tags/${id}`;  const body = {name}
    const res = await apiCalls.put(url, idToken, body);
      if (res.id) { toast({description: 'Tag updated'}); return res }
      else { toast({description: 'Updating tag failed'}); return {error: true} }
  }

  const editTagInState = (tag: Tag) => dispatch(editTag(tag));

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      if (!name) return toast({description: 'Name is required'});
    const res = await updateTagInDB(name);
      if (res.error) return
    editTagInState(res); router.push('/admin/tags');
  }


  useEffect(() => { populateForm() }, [tags])


  return (
    <Container>
      <div className='flex items-center gap-4 mb-8'>
        <div className='translate-y-1'><PackagePlus size={50} /></div>
        <h1 className='leading-none'>Edit Tag</h1>
      </div>

      <Card className='w-[100%] md:w-[50%] bg'>
        <CardHeader> 
          <CardTitle>Edit Tag</CardTitle>
          <CardDescription>Update tag name</CardDescription>
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

export default EditTagPage