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


export function CategoriesCombobox({ onValueChange, defaultValue = "" }: Props) {
  const clearingCategory = {id: 'clearcategory', name: 'any category'};
  const categories = [clearingCategory, ...useAppSelector((state) => state.categories)];
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
            categories.find((category) => category.id === value)?.name
            : 
            "Select category..."
          }
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." className="h-9" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {
                categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.id}
                    onSelect={(currentValue) => { changeValue(currentValue === value ? "" : currentValue); setOpen(false) }}
                  >
                    {category.name}
                    <CheckIcon className={cn("ml-auto h-4 w-4", value === category.id ? "opacity-100" : "opacity-0")} />
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
