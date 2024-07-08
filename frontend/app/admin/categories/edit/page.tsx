'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from "@/components/ui/textarea"
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from 'react'
import { PackagePlus } from 'lucide-react';
import { apiCalls } from '@/utils/apiCalls';
import { Category } from '@/models/models';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { editCategory } from '@/redux/slices/categoriesSlice';
import { useSearchParams } from 'next/navigation';
import FileUploadButton from '@/components/FileUploadButton';
import { X } from 'lucide-react';
import { loadImage, uploadImage } from '@/utils/imageUpload';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { useAuth } from '@/context/authContext';



export const dynamic = 'force-dynamic';



const EditCategoryPage = () => {
  const [category, setCategory] = useState({name: '', description: '', image: '', id: ''});
  const { name, description, image } = category;
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [disabled, setDisabled] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories);
  const params = useSearchParams(); 
  const id = params.get('id');
  const router = useRouter();
  const { user } = useAuth(); const { idToken } = user;
  

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const loadRes: any = await loadImage(e); 
    if (!(loadRes as any).base64) return toast({description: 'File failed to load'});
    else { setPreview(loadRes.base64); setFileName(loadRes.fileName); };
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setCategory({...category, [e.target.name]: e.target.value});
  }

  const clearPreview = () => setPreview('');

  const populateForm = () => {
    if (categories.length === 0) return;
    const idx = categories.findIndex((c: Category) => c.id === id); if (idx === -1) return;
    const c = categories[idx];
    console.log(c);
    setCategory({...c as any}); if (c.image) { setPreview(c.image); };
  }
  

  const updateCategoryInDB = async (name: string, description: string, image: string) => {
    const url = `/categories/${id}`; const body = {name, description, image}
    const res = await apiCalls.put(url, idToken, body);
    return res;
  }

  const editCategoryInState = (category: Category) => dispatch(editCategory(category));

  const wasImageChanged = () => category.image !== preview

  const uploadNewImage = async () => { const res = await uploadImage(fileName, preview, idToken); return res; };

  const handleEditCategoryFail = () => {
    toast({description: 'Saving category failed'});
    setDisabled(false);
  }

  const handleEditCategorySuccess = (updatedCategory: Category) => {
    toast({description: 'Category saved successfully'});
    setDisabled(false);
    editCategoryInState(updatedCategory);
    router.push('/admin/categories');
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (!name) return toast({description: 'Name is required'}); setDisabled(true);
    let updatedCategory;
      if (wasImageChanged()) {
        const uploadRes = await uploadNewImage(); if (!uploadRes.imageUrl) return handleEditCategoryFail();
        updatedCategory = {...category, image: uploadRes.imageUrl};
      } else { updatedCategory = {...category};}
    const updateRes = await updateCategoryInDB(updatedCategory.name, updatedCategory.description, updatedCategory.image); if (!updateRes.id) return handleEditCategoryFail();
    handleEditCategorySuccess(updateRes); 
  }


  useEffect(() => { populateForm() }, [categories]);


  return (
    <Container>
      <div className='flex items-center gap-4 mb-8'>
        <div className='translate-y-1'><PackagePlus size={50} /></div>
        <h1 className='leading-none'>Edit Category</h1>
      </div>

      <Card className='w-[90%] lg:w-[50%]'>
        <CardHeader> 
          <CardTitle>Edit Category</CardTitle>
          <CardDescription>Update category</CardDescription>
          </CardHeader>
        
          <CardContent>
            <form onSubmit={handleSubmit} className='w-100'>
              <Label htmlFor='name'>Category name</Label>
              <Input type='text' name='name' value={name} onChange={handleChange} className='mb-2' />
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
              <Button type='submit' className='w-[100%]'>Submit</Button>
            </form>
          </CardContent>
      </Card>
    </Container>
  )
}

export default EditCategoryPage