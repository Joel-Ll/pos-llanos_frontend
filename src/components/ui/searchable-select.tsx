import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { Badge } from "./badge";
import type { ProductCatalog } from "@/types/purchases/purchases-type";
import { getThumbnailUrl } from "@/utils";

interface Props {
  label: string;
  searchOpen: boolean;
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
  catalogProducts: ProductCatalog[] | undefined;
  handleAddProduct: (product: ProductCatalog) => void;
}

export const SearchableSelect = ({
  label,
  searchOpen,
  setSearchOpen,
  catalogProducts,
  handleAddProduct,
}: Props) => {
  return (
    <Popover open={searchOpen} onOpenChange={setSearchOpen}>
      <PopoverTrigger asChild>
        <Button type="button" className="gap-2">
          <Plus className="h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      {catalogProducts && (
        <PopoverContent className="w-96 p-0" align="end">
          <Command>
            <CommandInput placeholder="Buscar por código o descripción..." />
            <CommandList className="max-h-64">
              <CommandEmpty>No se encontraron productos.</CommandEmpty>
              <CommandGroup heading="Productos disponibles">
                {catalogProducts.map((p) => (
                  <CommandItem
                    key={p._id}
                    value={[
                      p.internalCode,
                      p.catalogCode,
                      p.description,
                      p.brand,
                    ]
                      .filter(Boolean)
                      .join(" ")
                      .toLowerCase()}
                    onSelect={() => handleAddProduct(p)}
                    className="cursor-pointer"
                  >
                    {/* Imagen + info */}
                    <div className="flex items-center gap-3" key={p._id}>
                      {p.image ? (
                        <img
                          src={getThumbnailUrl(p.image)}
                          alt={p.description}
                          className="w-15 h-15 rounded object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-15 h-15 bg-muted flex items-center justify-center rounded">
                          <Package className="w-4 h-4" />
                        </div>
                      )}

                      <div>
                        <p
                          className="text-xs font-medium truncate"
                          title={p.description}
                        >
                          {p.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          #{p.internalCode} -{" "}
                          {p.catalogCode === "" ? "s/n" : p.catalogCode}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {p.brand}
                        </Badge>
                      </div>
                    </div>
                    <Plus className="h-4 w-4 shrink-0 text-primary ml-auto" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};
