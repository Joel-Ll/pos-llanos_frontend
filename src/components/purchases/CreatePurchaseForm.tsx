import { useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelectSupplier } from "@/hooks/useSupplier";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  CalendarIcon,
  Minus,
  Package,
  ShoppingCart,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  Table,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Label } from "@/components/ui/label";

import type { SupplierSelect } from "@/types/suppliers/suppliers.type";
import {
  purchaseFormSchema,
  type ProductCatalog,
  type ProductItem,
  type PurchaseFormValues,
} from "@/types/purchases/purchases-type";

import { getProductsItemAction } from "@/actions/purchases/get-products-item.action";
import { registerPurchaseAction } from "@/actions/purchases/register-purchase.action";
import { cn } from "@/lib/utils";
import { formatDate, getThumbnailUrl } from "@/utils";
import { toast } from "sonner";
import type z from "zod";
import { es } from "date-fns/locale";

export const CreatePurchaseForm = () => {
  const navigate = useNavigate();
  const { data: suppliersSelect = [] } = useSelectSupplier();
  const [searchOpen, setSearchOpen] = useState(false);

  const suppliersActive =
    suppliersSelect?.filter((supp) => supp.isActive) || [];

  const { data: catalogProducts } = useQuery({
    queryKey: ["product-items"],
    queryFn: getProductsItemAction,
    retry: false,
  });

  const activeProducts = catalogProducts?.filter((prod) => prod.isActive) || [];

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      supplier: "",
      invoiceNumber: "",
      date: undefined,
      detail: "",
      items: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleAddProduct = (product: ProductCatalog) => {
    const currentItems = form.getValues("items");

    const exists = currentItems.find((i) => i._id === product._id);
    if (exists) {
      toast.error("El producto ya fue agregado");
      return;
    }

    append({ ...product, quantity: 1 });
    setSearchOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  const handleUpdateItem = (index: number, field: string, value: number) => {
    update(index, {
      ...fields[index],
      [field]: value,
    });
  };

  const getSubtotal = (item: ProductItem) => item.quantity * item.purchasePrice;
  const getTotal = (items: ProductItem[]) =>
    items.reduce((acc, item) => acc + getSubtotal(item), 0);

  const getPriceDiff = (current: number, previous?: number) => {
    if (!previous || previous === 0) return null;
    const diff = ((current - previous) / previous) * 100;
    if (Math.abs(diff) < 0.01) return { type: "equal" as const, diff: 0 };
    return { type: diff > 0 ? ("up" as const) : ("down" as const), diff };
  };

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: registerPurchaseAction,
    onError: (error: TypeError) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["product-items"] });
      navigate(-1);
      toast.success(data);
    },
  });

  function onSubmit(data: z.infer<typeof purchaseFormSchema>) {
    mutate(data);
  }

  const handleClose = () => {
    form.reset();
    navigate(-1);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Proveedor */}
            <Controller
              name="supplier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Proveedor *</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      aria-invalid={fieldState.invalid}
                      className="min-w-[120px]"
                    >
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {suppliersActive && suppliersActive.length > 0 ? (
                        <>
                          {suppliersActive.map((item: SupplierSelect) => (
                            <SelectItem key={item._id} value={item._id}>
                              {item.enterprise}
                            </SelectItem>
                          ))}
                        </>
                      ) : (
                        <>
                          <SelectItem disabled value="no-data">
                            No hay registros
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Nro Factura / Lote */}
            <Controller
              name="invoiceNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nro. Factura / Lote *
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Ej: FAC-00123"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Date */}
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Fecha *</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        aria-invalid={fieldState.invalid}
                        variant="outline"
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          formatDate(new Date(field.value))
                        ) : (
                          <span>Seleccione una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Notas */}
            <Controller
              name="detail"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Detalle / Observación
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Nota adicional..."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Detalle de Productos
            </CardTitle>

            <SearchableSelect
              label="Agregar Producto"
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              catalogProducts={activeProducts}
              handleAddProduct={handleAddProduct}
            />
          </div>
        </CardHeader>
        <CardContent>
          {form.getValues("items").length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground font-medium">
                No hay productos agregados
              </p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Use el botón "Agregar Producto" para buscar y seleccionar
              </p>
            </div>
          ) : (
            <>
              {/* desktop */}
              <div className="hidden lg:block rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead className="w-28 text-center">
                        Cantidad
                      </TableHead>
                      <TableHead className="w-36 text-center">
                        P. Compra
                      </TableHead>
                      <TableHead className="w-36 text-center">
                        P. Venta
                      </TableHead>
                      <TableHead className="w-32 text-right">
                        Subtotal
                      </TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.getValues("items").map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className="text-muted-foreground font-mono text-xs py-8">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 w-[300px]">
                            {item.image ? (
                              <img
                                src={getThumbnailUrl(item.image)}
                                alt="imagen producto"
                                className="h-15 w-15 rounded object-cover shrink-0"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-15 w-15 rounded bg-muted flex items-center justify-center shrink-0">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}

                            <div className="min-w-0 flex-1 flex flex-col gap-1">
                              <p
                                className="font-medium text-sm leading-tight truncate"
                                title={item.description}
                              >
                                {item.description}
                              </p>

                              <p className="text-xs text-muted-foreground truncate">
                                #{item.internalCode} •{" "}
                                {item.catalogCode === ""
                                  ? "s/n"
                                  : item.catalogCode}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateItem(
                                index,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            className="text-center h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Input
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  value={item.purchasePrice || 0}
                                  onChange={(e) =>
                                    handleUpdateItem(
                                      index,
                                      "purchasePrice",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="text-center h-9"
                                />
                              </TooltipTrigger>

                              {item.purchasePrice != null &&
                                (() => {
                                  const originalProduct = catalogProducts?.find(
                                    (p) => p._id === item._id
                                  );
                                  if (!originalProduct?.purchasePrice)
                                    return null;

                                  const info = getPriceDiff(
                                    item.purchasePrice,
                                    originalProduct.purchasePrice
                                  );

                                  return (
                                    <TooltipContent>
                                      <div className="flex items-center gap-1.5 text-xs">
                                        <span>
                                          Anterior: Bs.{" "}
                                          {originalProduct.purchasePrice.toFixed(
                                            2
                                          )}
                                        </span>
                                        {info && info.type === "up" && (
                                          <span className="text-red-400 flex items-center gap-0.5">
                                            <TrendingUp className="h-3 w-3" />+
                                            {info.diff.toFixed(1)}%
                                          </span>
                                        )}
                                        {info && info.type === "down" && (
                                          <span className="text-emerald-400 flex items-center gap-0.5">
                                            <TrendingDown className="h-3 w-3" />
                                            {info.diff.toFixed(1)}%
                                          </span>
                                        )}
                                        {info && info.type === "equal" && (
                                          <span className="flex items-center gap-0.5">
                                            <Minus className="h-3 w-3" />
                                            0%
                                          </span>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  );
                                })()}
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Input
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  value={item.salePrice}
                                  onChange={(e) =>
                                    handleUpdateItem(
                                      index,
                                      "salePrice",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="text-center h-9"
                                />
                              </TooltipTrigger>
                              {item.salePrice != null &&
                                (() => {
                                  const originalProduct = catalogProducts?.find(
                                    (p) => p._id === item._id
                                  );
                                  if (!originalProduct?.purchasePrice)
                                    return null;

                                  const info = getPriceDiff(
                                    item.salePrice,
                                    originalProduct.salePrice
                                  );
                                  return (
                                    <TooltipContent>
                                      <div className="flex items-center gap-1.5 text-xs">
                                        <span>
                                          Anterior: Bs.{" "}
                                          {originalProduct.salePrice.toFixed(2)}
                                        </span>
                                        {info && info.type === "up" && (
                                          <span className="text-emerald-400 flex items-center gap-0.5">
                                            <TrendingUp className="h-3 w-3" />+
                                            {info.diff.toFixed(1)}%
                                          </span>
                                        )}
                                        {info && info.type === "down" && (
                                          <span className="text-red-400 flex items-center gap-0.5">
                                            <TrendingDown className="h-3 w-3" />
                                            {info.diff.toFixed(1)}%
                                          </span>
                                        )}
                                        {info && info.type === "equal" && (
                                          <span className="flex items-center gap-0.5">
                                            <Minus className="h-3 w-3" />
                                            0%
                                          </span>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  );
                                })()}
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">
                          Bs. {getSubtotal(item).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-right font-semibold text-base"
                      >
                        Total:
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg text-primary tabular-nums">
                        Bs. {getTotal(form.getValues("items")).toLocaleString()}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>

              {/* mobile */}
              <div className="lg:hidden space-y-4">
                {form.getValues("items").map((item, index) => (
                  <>
                    <Card key={item._id}>
                      <CardContent className="p-4 space-y-4">
                        {/* Producto */}
                        <div className="flex gap-3">
                          {item.image ? (
                            <img
                              src={getThumbnailUrl(item.image)}
                              className="h-16 w-16 rounded object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                              <Package className="h-5 w-5" />
                            </div>
                          )}

                          <div className="flex flex-col gap-2">
                            <p className="font-medium leading-tight text-md">
                              {item.description}
                            </p>

                            <p className="text-xs text-muted-foreground truncate">
                              #{item.internalCode} •{" "}
                              {item.catalogCode === ""
                                ? "s/n"
                                : item.catalogCode}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        {/* Cantidad */}
                        <div className="space-y-2">
                          <Label>Cantidad</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateItem(
                                index,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>

                        {/* Compra */}
                        <div className="space-y-2">
                          <Label>Precio compra</Label>
                          <Input
                            type="number"
                            value={item.purchasePrice}
                            onChange={(e) =>
                              handleUpdateItem(
                                index,
                                "purchasePrice",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>

                        {/* Venta */}
                        <div className="space-y-2">
                          <Label>Precio venta</Label>
                          <Input
                            type="number"
                            value={item.salePrice}
                            onChange={(e) =>
                              handleUpdateItem(
                                index,
                                "salePrice",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>

                        {/* Total */}
                        <div className="flex justify-between border-t pt-3">
                          <span className="font-medium">Subtotal</span>

                          <span className="font-bold text-primary">
                            Bs. {getSubtotal(item).toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="mt-4">
                      <CardContent className="flex justify-between items-center py-5">
                        <span className="font-semibold">
                          Total de la compra
                        </span>

                        <span className="text-2xl font-bold text-primary">
                          Bs.{" "}
                          {getTotal(form.getValues("items")).toLocaleString()}
                        </span>
                      </CardContent>
                    </Card>
                  </>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end mt-5">
        <Button type="button" variant="outline" onClick={handleClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!form.getValues("items").length}>
          Aceptar
        </Button>
      </div>
    </form>
  );
};
