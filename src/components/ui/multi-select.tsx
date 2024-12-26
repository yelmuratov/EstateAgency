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

export function MultiSelect() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string[]>([])
  const [districts, setDistricts] = React.useState<District[]>([])
  const { returnDistricts, loading } = usePropertyStore()

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await returnDistricts()
      setDistricts(response)
    }

    fetchData()
  }, [returnDistricts])

  if (loading) return <Spinner theme="dark" />

  const handleSetValue = (val: string) => {
    setValue((prevValue) => 
      prevValue.includes(val) 
        ? prevValue.filter((item) => item !== val)
        : [...prevValue, val]
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full min-w-[280px] max-w-[480px] justify-between border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          <div className="flex flex-wrap gap-1.5 pe-2">
            {value?.length > 0 ? (
              value.map((val) => (
                <div
                  key={val}
                  className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-0.5 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
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
      <PopoverContent className="w-full min-w-[280px] max-w-[480px] p-0">
        <Command className="w-full">
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
                    className="cursor-pointer aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
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
  )
}

