import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { getThumbnailUrl } from "@/utils";
import { Badge } from "../ui/badge";

export interface SearchableSelectOption {
  value: string;
  internalCode: string; // código interno  → búsqueda
  catalogCode: string; // código catálogo → búsqueda
  description: string; // descripción     → búsqueda
  brand: string;
  image: string;
  stock: number;
}

interface Props {
  options?: SearchableSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

export const SelectProducts = ({
  options,
  value,
  onValueChange,
  placeholder = "Seleccionar producto...",
  searchPlaceholder = "Buscar por código o descripción...",
  emptyMessage = "Sin resultados",
  className,
  disabled,
}: Props) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options?.find((o) => o.value === value);

  const handleSelect = (option: SearchableSelectOption) => {
    onValueChange?.(option.value === value ? "" : option.value);
    setOpen(false);
  };

  // Cadena que cmdy usa para filtrar — incluye los tres campos buscables
  const searchValue = (option: SearchableSelectOption) =>
    [option.internalCode, option.catalogCode, option.description]
      .filter(Boolean)
      .join(" ");

  return (
    <div className="space-y-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground",
              className
            )}
          >
            {selectedOption ? (
              <div className="flex items-center gap-2 min-w-0">
                <p className="truncate text-sm">
                  {selectedOption.description}
                  {" - "}
                  <span className="text-muted-foreground">
                    {selectedOption.catalogCode}
                  </span>

                  {" - "}
                  <span className="text-muted-foreground">
                    {selectedOption.brand}
                  </span>
                </p>
              </div>
            ) : (
              <span>{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[500px] max-w-[calc(100vw-2rem)] p-0"
          align="start"
        >
          <Command
            filter={(itemValue, search) => {
              const option = options?.find((o) => searchValue(o) === itemValue);
              if (!option) return 0;
              const hay = searchValue(option).toLowerCase();
              return hay.includes(search.toLowerCase()) ? 1 : 0;
            }}
          >
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList className="max-h-60">
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options?.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={searchValue(option)}
                    onSelect={() => handleSelect(option)}
                    className="flex min-w-0 items-center"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0 mr-2",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />

                    <div className="flex items-center gap-3">
                      {option.image ? (
                        <img
                          src={getThumbnailUrl(option.image)}
                          alt={option.description}
                          className="w-15 h-15 rounded object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-15 h-15 bg-muted flex items-center justify-center rounded">
                          <Package className="w-4 h-4" />
                        </div>
                      )}

                      <div className="ml-2 min-w-0 flex-1">
                        <p
                          className="text-xs font-medium text-ellipsis"
                          title={option.description}
                        >
                          {option.description}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          #{option.internalCode} -{" "}
                          {option.catalogCode === ""
                            ? "s/n"
                            : option.catalogCode}
                        </p>

                        <Badge variant="outline" className="text-xs">
                          {option.brand}
                        </Badge>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "ml-auto text-xs px-1.5 py-0.5 rounded-full shrink-0",
                        option.stock > 0
                          ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                      )}
                    >
                      {option.stock}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedOption && (
        <p className="text-xs text-muted-foreground">
          Stock actual:{" "}
          <span
            className={cn(
              "font-semibold",
              selectedOption.stock > 0 ? "text-green-600" : "text-red-500"
            )}
          >
            {selectedOption.stock}
          </span>{" "}
          unidades
        </p>
      )}
    </div>
  );
};
