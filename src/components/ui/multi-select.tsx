"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from 'lucide-react'
import usePropertyStore, { District } from "@/store/MetroDistrict/propertyStore"
import { v4 as uuidv4 } from 'uuid'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import Spinner from "../local-components/spinner"

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelect({ value, onChange }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [districts, setDistricts] = React.useState<District[]>([]);
  const { returnDistricts, loading } = usePropertyStore();

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await returnDistricts();
      setDistricts(response);
    };

    fetchData();
  }, [returnDistricts]);

  if (loading) return <Spinner theme="dark" />;

  const handleSetValue = (val: string) => {
    onChange(
      value.includes(val)
        ? value.filter((item) => item !== val)
        : [...value, val]
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-1.5 pe-2">
            {value?.length > 0 ? (
              value.map((val) => (
                <div
                  key={val}
                  className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-sm font-medium"
                >
                  {districts.find((district) => district.name === val)?.name}
                </div>
              ))
            ) : (
              <span className="text-muted-foreground">Выберите район</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Поиск района" className="h-9" />
          <CommandEmpty className="py-2 text-center text-sm">
            Нет найденных районов
          </CommandEmpty>
          <ScrollArea className="h-[200px]">
            <CommandList>
              <CommandGroup>
                {districts.map((district) => (
                  <CommandItem
                    key={uuidv4()}
                    value={district.name}
                    onSelect={() => handleSetValue(district.name)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(district.name)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {district.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

