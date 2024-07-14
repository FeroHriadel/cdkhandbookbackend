"use client";

import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/redux/store";

type Props = {
  onValueChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
};

const CategoriesSelect = ({ onValueChange, className, defaultValue = ""}: Props) => {
  const categories = useAppSelector((state) => state.categories);

  if (categories.length === 0) return <></>;

  return (
    <div className={className || ''}>
      <Select onValueChange={onValueChange} defaultValue={defaultValue}>
        <SelectTrigger className="w-[100%]">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
              <SelectItem key="clearcategory" value="clearcategory">no category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoriesSelect;
