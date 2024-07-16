'use client'

import React, { useEffect, useState} from 'react';
import { useSearchParams } from 'next/navigation';
import { apiCalls } from '@/utils/apiCalls';
import { toast } from '@/components/ui/use-toast';
import { Item } from '@/models/models';
import Container from '@/components/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FileUploadButton from '@/components/FileUploadButton';
import CategoriesSelect from '@/components/CategoriesSelect';
import TagsSelect from '@/components/TagsSelect';
import { X } from "lucide-react";
import { loadImages, uploadImages } from '@/utils/imageUpload';
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/authContext';



export const dynamic = 'force-dynamic';



interface Props {
  rediretTo?: string;
}

const maxImages = 5;

const EditItemPage = ({ rediretTo = '/admin/items'}: Props) => {
  const [item, setItem] = useState<Item>({name: "", description: "", images: [], tags: [], category: ""});
  const { name, description, images, tags, category } = item;
  const [disabled, setDisabled] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ base64: string; fileName: string }[]>([]);
  const params = useSearchParams();
  const id = params.get('id');
  const router = useRouter();
  const { user } = useAuth(); const { idToken } = user;


  const getItem = async () => {
    const url = `/items?item=${id}`;
    const res = await apiCalls.get(url);
    if (!res.id) return toast({description: 'Failed to get item'});
    setItem({...res, images: res.images, tags: res.tags});
  }

  const handleChange = (e: | React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (v: string) => {
    if (v === 'clearcategory') return setItem({...item, category: ''});
    setItem((prev) => ({...prev, category: v}));
  };

  const handleTagsChange = (v: string) => {
    if (!tags!.includes(v)) setItem({ ...item, tags: [...tags as [], v] });
    else setItem({ ...item, tags: tags?.filter((t) => t !== v) });
  }

  const clearPreview = (img: { base64: string; fileName: string }) => {
    const newImages = selectedImages.filter((i) => i.fileName !== img.fileName);
    setSelectedImages(newImages);
  };

  const isOverMaxNumberOfImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && item.images!.length + e.target.files.length > maxImages) return true;
    return false
  }

  const onImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isOverMaxNumberOfImages(e)) return toast({ description: `Item can only have ${maxImages} images.` });
    const res = await loadImages(e, maxImages); if (res.error) return toast({ description: res.error });
    setSelectedImages(res.imagesData);
  };

  const clearSavedImage = (url: string) => {
    setItem({...item, images: item.images!.filter(i => i !== url)});
  }

  const saveToDB = async (objectUrls: string[]) => {
    const newImages = [...item.images!, ...objectUrls];
    const body = { ...item, images: newImages };
    const res = await apiCalls.put(`/items/${item.id}`, idToken, body);
    return res;
  };

  const handleSubmitError = () => {
    toast({ description: "Failed to edit item" });
    setDisabled(false);
  }

  const handleSubmitSuccess = () => {
    toast({ description: "Item updated successfully" });
    setItem({ name: "", description: "", images: [], tags: [], category: "" });
    setDisabled(false);
    router.push(rediretTo);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (!name) return toast({ description: "Name is required" }); 
    setDisabled(true); toast({description: 'Updating item...'});
    const uploadRes = await uploadImages(selectedImages, idToken); if (uploadRes.error) return handleSubmitError();
    const saveToDBRes = await saveToDB(uploadRes.objectUrls!); if (saveToDBRes.error) return handleSubmitError();
    handleSubmitSuccess();
  }


  useEffect(() => { getItem(); }, []);


  return (
    <Container>
      <h1 className="my-8 text-center">Edit Item</h1>

      <Card className="w-[90%] lg:w-[50%] m-auto mb-5">
        <CardHeader>
          <CardTitle>Edit Item</CardTitle>
          <CardDescription>Edit an existing item</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="w-100">
            <Label htmlFor="name">Item name</Label>
            <Input type="text" name="name" value={name} onChange={handleChange} className="mb-2" disabled={disabled} />

            <Label htmlFor="description">Item Description</Label>
            <Textarea name="description" value={description} onChange={handleChange} className="mb-2" disabled={disabled} />

            <CategoriesSelect onValueChange={handleCategoryChange} className="mb-2" defaultValue={item.category} key={item.category} />
            {tags && <TagsSelect onCheckedChange={handleTagsChange} selectedTags={tags}/>} <br />

            {/* Saved Images */}
            {item.images && item.images!.length > 0 && (
              <>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Saved Images</label>
                <div className="w-100 flex justify-center flex-wrap gap-2">
                  {item.images!.map((img, idx) => (
                    <div
                      className="w-[50px] h-[50px] rounded-full relative"
                      style={{
                        background: `url(${img}) no-repeat center center/cover`,
                      }}
                      key={`img-${idx}`}
                    >
                      <div
                        className="w-[20px] h-[20px] rounded-full bg-black absolute top-0 right-[-5px] cursor-pointer flex justify-center items-center"
                        onClick={() => clearSavedImage(img)}
                      >
                        <p className='text-white'>
                          <X size={15} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* New Images */}
            {
              selectedImages && selectedImages.length > 0 && (
                <>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">New Images</label>
                  <div className="w-100 flex justify-center flex-wrap gap-2">
                    {selectedImages.map((img, idx) => (
                      <div
                        className="w-[50px] h-[50px] rounded-full relative"
                        style={{
                          background: `url(${img.base64}) no-repeat center center/cover`,
                        }}
                        key={`img-${idx}`}
                      >
                        <div
                          className="w-[20px] h-[20px] rounded-full bg-black absolute top-0 right-[-5px] cursor-pointer flex justify-center items-center"
                          onClick={() => clearPreview(img)}
                        >
                          <p className='text-white'>
                            <X size={15} />
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            }
            <FileUploadButton onChange={onImagesUpload} disabled={disabled} max={maxImages.toString()} text="Upload New Images" /><br />

            <Button type="submit" className="w-[100%]" disabled={disabled}>Submit</Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

export default EditItemPage