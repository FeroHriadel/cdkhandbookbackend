'use client'

import { useEffect } from "react";
import { apiCalls } from "@/utils/apiCalls";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCategories } from "@/redux/slices/categoriesSlice";



export const dynamic = 'force-dynamic';



const CategoriesFetcher = () => {
  const dispatch = useAppDispatch();
  const CategoriesFetcher = useAppSelector(state => state.categories);

  const fetchCategories = async () => {
    const res = await apiCalls.get('/categories', 'idToken');
    if (!res.error) dispatch(setCategories(res));
  };

  useEffect(() => {fetchCategories();}, []);

  return (<></>);
};

export default CategoriesFetcher;