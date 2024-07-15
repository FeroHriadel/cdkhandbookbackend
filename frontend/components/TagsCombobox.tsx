"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CommandList } from "cmdk"
import { useAppSelector } from "@/redux/store";


interface Props {
  onValueChange: (value: string) => void;
  defaultValue?: string;
}


export function TagsCombobox({ onValueChange, defaultValue = "" }: Props) {
  const clearingTag = {id: 'cleartag', name: 'No Tag'};
  const tags = [clearingTag, ...useAppSelector((state) => state.tags)];
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const changeValue = (v: string) => {
    setValue(v);
    onValueChange(v);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {
            value
            ? 
            tags.find((tag) => tag.id === value)?.name
            : 
            "Select tag..."
          }
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tag..." className="h-9" />
          <CommandList>
            <CommandEmpty>No tag found.</CommandEmpty>
            <CommandGroup>
              {
                tags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.id}
                    onSelect={(currentValue) => { changeValue(currentValue === value ? "" : currentValue); setOpen(false) }}
                  >
                    {tag.name}
                    <CheckIcon className={cn("ml-auto h-4 w-4", value === tag.id ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))
              }
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
