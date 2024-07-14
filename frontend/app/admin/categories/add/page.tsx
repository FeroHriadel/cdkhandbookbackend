'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import { useState } from 'react'
import { PackagePlus, X } from 'lucide-react';
import { apiCalls } from '@/utils/apiCalls';
import { Category } from '@/models/models';
import { useAppDispatch } from '@/redux/store';
import { addCategory } from '@/redux/slices/categoriesSlice';
import { loadImage, uploadImage } from '@/utils/imageUpload';
import FileUploadButton from '@/components/FileUploadButton';
import Container from '@/components/Container'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'



export const dynamic = 'force-dynamic';



const AddCategoryPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [disabled, setDisabled] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user } = useAuth(); const { idToken } = user;
  const router = useRouter();
 

  const saveCategoryToDB = async (name: string, description: string, image: string) => {
    const url = '/categories'; 
    const body = {name, description, image};
    const res = await apiCalls.post(url, idToken, body);
      if (res.id) { toast({description: 'Category saved'}); return res }
      else { toast({description: 'Saving Category failed'}); return {error: true} }
  }

  const addCategoryToState = (category: Category) => dispatch(addCategory(category));

  const handleChange = (e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.name === 'name') setName(e.target.value) 
    else setDescription(e.target.value);
  }

  const clearPreview = () => { setPreview(''); setFileName(''); }

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const loadRes: any = await loadImage(e); 
      if (!(loadRes as any).base64) return toast({description: 'File failed to load'})
      else { setPreview(loadRes.base64); setFileName(loadRes.fileName); } 
  }

  const handleSaveError = (msg: string) => {
    toast({description: msg});
    setDisabled(false);
  }

  const handleSaveSuccess = (category: Category) => {
    addCategoryToState(category);
    setDisabled(false);
    setName('');
    setDescription('');
    setPreview('');
    toast({description: 'Category saved'});
    router.push('/admin/categories');
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if (!name) return handleSaveError('Name is required');
    toast({description: 'Saving...'}); setDisabled(true);
    if (preview) {
      const uploadedImg = await uploadImage(fileName, preview, idToken); if (!uploadedImg.imageUrl) return handleSaveError(uploadedImg.error);
      const saveRes = await saveCategoryToDB(name, description, uploadedImg.imageUrl); if (!saveRes.id) return handleSaveError('Saving failed');
      handleSaveSuccess(saveRes);
    } else {
      const saveRes = await saveCategoryToDB(name, description, ''); if (!saveRes.id) return handleSaveError('Saving failed');
      handleSaveSuccess(saveRes);
    }
  }


  return (
    <Container>
      <div className='flex items-center gap-4 mb-8'>
        <div className='translate-y-1'><PackagePlus size={50} /></div>
        <h1 className='leading-none'>Add Category</h1>
      </div>

      <Card className='w-[90%] lg:w-[50%]'>
        <CardHeader> 
          <CardTitle>Add Category</CardTitle>
          <CardDescription>Create a new category</CardDescription>
          </CardHeader>
        
          <CardContent>
            <form onSubmit={handleSubmit} className='w-100'>
              <Label htmlFor='name'>Category name</Label>
              <Input type='text' name='name' value={name} onChange={handleChange} className='mb-2' disabled={disabled} />
              <Label htmlFor='description'>Category Description</Label>
              <Textarea name='description' value={description} onChange={handleChange} className='mb-2' disabled={disabled} />
              {
                preview
                &&
                <div className='w-100 h-[300px] rounded relative' style={{background: `url(${preview}) no-repeat center center/cover`}}>
                  <p className='absolute top-2 right-2 cursor-pointer' onClick={clearPreview}><X /></p>
                </div>
              }
              <FileUploadButton onChange={onImageUpload} disabled={disabled} />
              <br />
              <Button type='submit' className='w-[100%]' disabled={disabled}>Submit</Button>
            </form>
          </CardContent>
        </Card>
      </Container>
  )
}

export default AddCategoryPage