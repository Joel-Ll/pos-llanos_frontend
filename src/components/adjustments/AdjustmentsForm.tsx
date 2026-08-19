import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import type z from "zod";
import { ArrowUpDown, Minus, Plus } from "lucide-react";
import {
  adjustmentsFormSchema,
  type AdjustmentsFormValues,
} from "@/types/adjustments/adjustments.type";
import { createAdjustementAction } from "@/actions/adjustments/create-adjustment.action";
import { getProductsAction } from "@/actions/products/get-products.action";
import { SelectProducts } from "./SelectProducts";
import { Spinner } from "../ui/spinner";

const decreaseReasons = [
  { label: "Producto dañado", id: 1 },
  { label: "Pérdida / Extravío", id: 2 },
  { label: "Corrección de inventario", id: 3 },
  { label: "Devolución a proveedor", id: 4 },
  { label: "Donación", id: 5 },
  { label: "Consumo interno", id: 6 },
  { label: "Otro", id: 7 },
];

const increaseReasons = [
  { label: "Corrección de inventario", id: 1 },
  { label: "Devolución de cliente", id: 2 },
  { label: "Ajuste por sobrante", id: 3 },
  { label: "Inventario inicial", id: 4 },
  { label: "Otro", id: 5 },
];

export const AdjustmentsForm = () => {
  const form = useForm<AdjustmentsFormValues>({
    resolver: zodResolver(adjustmentsFormSchema),
    defaultValues: {
      product: "",
      adjustmentType: "decrement",
      quantity: undefined,
      reason: "",
      note: "",
    },
  });
  const adjustmentType = form.watch("adjustmentType");

  // Traer productos;
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsAction,
    retry: false,
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createAdjustementAction,
    onError: (error: TypeError) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["adjustments"] });
      toast.success(data);
      form.reset();
    },
  });

  const watchedQuantity = form.watch("quantity");

  const productOptions = data?.products.map((p) => ({
    value: p._id,
    internalCode: p.internalCode ?? "",
    catalogCode: p.catalogCode ?? "",
    brand: p.brand ?? "",
    description: p.description,
    image: p.image ?? "",
    stock: p.currentStock,
  }));

  const selectedProduct = productOptions?.find(
    (p) => p.value === form.watch("product")
  );
  const currentStock = selectedProduct?.stock;

  function onSubmit(data: z.infer<typeof adjustmentsFormSchema>) {
    mutate(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nuevo Ajuste de Stock</CardTitle>
        <CardDescription>
          Registra entradas y salidas de inventario con justificación
          documentada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} id="form-rhf-demo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Producto */}
            <Controller
              name="product"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Producto *</FieldLabel>

                  <SelectProducts
                    value={field.value}
                    onValueChange={field.onChange}
                    options={productOptions}
                    placeholder="Seleccionar producto..."
                    searchPlaceholder="Buscar por código o descripción..."
                    emptyMessage="No se encontró el producto"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Tipo de ajuste */}
            <Controller
              name="adjustmentType"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Tipo de Ajuste</FieldLabel>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={
                        field.value === "decrement" ? "default" : "outline"
                      }
                      className={`flex-1 gap-2 ${
                        field.value === "decrement"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : ""
                      }`}
                      onClick={() => field.onChange("decrement")}
                    >
                      <Minus className="h-4 w-4" />
                      Reducir
                    </Button>
                    <Button
                      type="button"
                      variant={
                        field.value === "increment" ? "default" : "outline"
                      }
                      className={`flex-1 gap-2 ${
                        field.value === "increment"
                          ? "bg-lime-500 hover:bg-lime-500 text-white"
                          : ""
                      }`}
                      onClick={() => field.onChange("increment")}
                    >
                      <Plus className="h-4 w-4" />
                      Incrementar
                    </Button>
                  </div>
                </Field>
              )}
            />

            {/* Cantidad */}
            <Controller
              name="quantity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Cantidad *</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                  {currentStock !== undefined &&
                    watchedQuantity !== undefined && (
                      <p className="text-xs text-muted-foreground">
                        Nuevo stock:{" "}
                        <span className="font-semibold">
                          {form.getValues("adjustmentType") === "increment"
                            ? currentStock + Number(watchedQuantity)
                            : currentStock - Number(watchedQuantity)}
                        </span>{" "}
                        unidades
                      </p>
                    )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Razón */}
            <Controller
              name="reason"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Razón *</FieldLabel>
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
                      {adjustmentType === "decrement" ? (
                        <>
                          {decreaseReasons.map((item) => (
                            <SelectItem key={item.id} value={item.label}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </>
                      ) : (
                        <>
                          {increaseReasons.map((item) => (
                            <SelectItem key={item.id} value={item.label}>
                              {item.label}
                            </SelectItem>
                          ))}
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

            {/* Nota */}
            <Controller
              name="note"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="md:col-span-2"
                >
                  <FieldLabel htmlFor={field.name}>Nota (opcional)</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    rows={2}
                    aria-invalid={fieldState.invalid}
                    placeholder="Observaciones adicionales..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex justify-end mt-10">
            <Button
              type="submit"
              form="form-rhf-demo"
              className="gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Cargando...
                </>
              ) : (
                <>
                  <ArrowUpDown className="h-4 w-4" />
                  Registrar Ajuste
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
