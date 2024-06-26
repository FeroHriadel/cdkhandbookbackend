'use client'

import { useEffect } from "react";
import { apiCalls } from "@/utils/apiCalls";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setTags } from "@/redux/slices/tagsSlice";



//disable caching on client-rendered pgs: export const dynamic = 'force-dynamic'
//disable caching on server-rendered pgs: const res = await fetch(`${process.env.NEXT_PUBLIC_API}/items`, {cache: 'no-store'}); //{cache: 'no-store'} turns off caching
export const dynamic = 'force-dynamic'; 



const TagsFetcher = () => {
  const dispatch = useAppDispatch();
  const tags = useAppSelector(state => state.tags);

  const fetchTags = async () => {
    const res = await apiCalls.get('/tags', 'idToken');
    if (!res.error) dispatch(setTags(res));
  };

  useEffect(() => {fetchTags();}, []);

  return (<></>);
};

export default TagsFetcher;