"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUploadButton from "@/components/FileUploadButton";
import { Button } from "@/components/ui/button";
import { loadImages, uploadImages } from "@/utils/imageUpload";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import { apiCalls } from "@/utils/apiCalls";
import { Item } from "@/models/models";
import CategoriesSelect from "@/components/CategoriesSelect";
import TagsSelect from "@/components/TagsSelect";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { useAuth } from "@/context/authContext";



interface Props {
  redirectUrl?: string;
}


const maxImages = 5;



const AddItemPage = ({ redirectUrl = '/admin/items' }: Props) => {
  const [item, setItem] = useState<Item>({name: "", description: "", images: [], tags: [], category: ""});
  const { name, description, images, tags, category } = item;
  const [selectedImages, setSelectedImages] = useState<{ base64: string; fileName: string }[]>([]);
  const [disabled, setDisabled] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth(); const { idToken } = user;


  const onImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const res = await loadImages(e, maxImages);
    if (res.error) return toast({ description: res.error });
    setSelectedImages(res.imagesData);
  };

  const clearPreview = (img: { base64: string; fileName: string }) => {
    const newImages = selectedImages.filter((i) => i.fileName !== img.fileName);
    setSelectedImages(newImages);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (v: string) => {
    if (v === 'clearcategory') return setItem({...item, category: ''});
    setItem({ ...item, category: v });
  };

  const handleTagsChange = (v: string) => {
    if (!tags!.includes(v)) setItem({ ...item, tags: [...tags as [], v] });
    else setItem({ ...item, tags: tags?.filter((t) => t !== v) });
  }

  const handleSubmitError = () => {
    toast({ description: "Failed to add item" });
    setDisabled(false);
  };

  const handleSubmitSuccess = () => {
    toast({ description: "Item added successfully" });
    setItem({ name: "", description: "", images: [], tags: [], category: "" });
    setDisabled(false);
    router.push(redirectUrl);
  };

  const saveToDB = async (objectUrls: string[]) => {
    const body = { ...item, images: objectUrls };
    const res = await apiCalls.post("/items", idToken, body);
    return res;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (!name) return toast({ description: "Name is required" }); 
    setDisabled(true); toast({description: 'Saving item...'})
    const uploadRes = await uploadImages(selectedImages, idToken); if (uploadRes.error) return handleSubmitError();
    const saveToDBRes = await saveToDB(uploadRes.objectUrls!); if (saveToDBRes.error) return handleSubmitError();
    handleSubmitSuccess();
  };


  return (
    <Container>
      <h1 className="my-8 text-center">Add Item</h1>

      <Card className="w-[90%] lg:w-[50%] m-auto">
        <CardHeader>
          <CardTitle>Add Item</CardTitle>
          <CardDescription>Create a new item</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="w-100">
            <Label htmlFor="name">Item name</Label>
            <Input type="text" name="name" value={name} onChange={handleChange} className="mb-2" disabled={disabled} />

            <Label htmlFor="description">Item Description</Label>
            <Textarea name="description" value={description} onChange={handleChange} className="mb-2" disabled={disabled} />

            <CategoriesSelect onValueChange={handleCategoryChange} className="mb-2"/>
            <TagsSelect onCheckedChange={handleTagsChange} selectedTags={tags} /> <br />

            {selectedImages.length > 0 && (
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
                      <p className="text-white">
                        <X size={15} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <FileUploadButton onChange={onImagesUpload} disabled={disabled} max={maxImages.toString()} text="Upload Images" /><br />

            <Button type="submit" className="w-[100%]" disabled={disabled}>Submit</Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddItemPage;
