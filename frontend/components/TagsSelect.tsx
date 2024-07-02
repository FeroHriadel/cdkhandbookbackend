"use client";

import React from "react";
import { useAppSelector } from "@/redux/store";
import { Checkbox } from "@/components/ui/checkbox"



type Props = {
  onCheckedChange: (value: string) => void;
  className?: string;
  selectedTags?: string[];
};



const TagsSelect = ({ onCheckedChange, className, selectedTags = [] }: Props) => {
  const tags = useAppSelector((state) => state.tags);

  const isTagSelected = (tagId: string) => { return selectedTags.includes(tagId); };  

  if (tags.length === 0) return <></>;

  return (
    <div className={className || ''}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Select tags</label>
      <div className="flex items-center justify-center flex-wrap gap-5">
        {tags.map((tag) => (
            <div key={tag.id}>
            <Checkbox key={tag.id} checked={isTagSelected(tag.id)} onCheckedChange={(isChecked: boolean) => onCheckedChange(tag.id)} />
            {' '}
            <label htmlFor={tag.id}>{tag.name}</label>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TagsSelect;
