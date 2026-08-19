import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectCategory } from "@/hooks/useCategory";
import { useSelectSupplier } from "@/hooks/useSupplier";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import UploadImage from "@/components/UploadImage";
import {
  productFormSchema,
  unitType,
  type ProductFormValues,
} from "@/types/products/products.type";
import type { SupplierSelect } from "@/types/suppliers/suppliers.type";
import { createProductAction } from "@/actions/products/create-product.action";
import { Spinner } from "@/components/ui/spinner";

export default function CreateProductView() {
  const navigate = useNavigate();
  const [publicId, setPublicId] = useState<string | undefined>("");
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const { data: categoriesSelect } = useSelectCategory();
  const { data: suppliersSelect } = useSelectSupplier();
  const suppliersActive =
    suppliersSelect?.filter((supp) => supp.isActive) || [];

  const activeCategories =
    categoriesSelect?.filter((cat) => cat.isActive) || [];

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      catalogCode: "",
      location: "",
      description: "",
      image: "",
      category: "",
      supplier: "",
      brand: "",
      unidadMedida: "",
      minStock: undefined,
      purchasePrice: undefined,
      salePrice: undefined,
      discountReference: undefined,
    },
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createProductAction,
    onError: (error: TypeError) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(data);
      handleClose();
    },
  });

  const handleSubmit = (formData: ProductFormValues) => {
    mutate(formData);
  };

  const handleClose = () => {
    form.reset();
    navigate(-1);
  };

  return (
    <div data-aos="fade-in" data-aos-duration="300">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl">
            Registrar Producto
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Image Upload */}
              <UploadImage
                form={form}
                publicId={publicId}
                setPublicId={setPublicId}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Código de catálogo */}
                <FormField
                  control={form.control}
                  name="catalogCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Catálogo (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="LD-7153" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Marca */}
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input placeholder="FRICCION" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Categoría */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-auto">
                            <SelectValue placeholder="Selecciona categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeCategories.length > 0 ? (
                            activeCategories.map((item) => (
                              <SelectItem
                                key={item._id}
                                value={item._id}
                                className="uppercase"
                              >
                                {item.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="no-data">
                              No hay categorías activas
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Proveedor */}
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proveedor Principal</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-auto">
                            <SelectValue placeholder="Selecciona Proveedor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Unidad de Medida */}
                <FormField
                  control={form.control}
                  name="unidadMedida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidad Medida</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-auto">
                            <SelectValue placeholder="Selecciona una medida" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="item-aligned">
                          {unitType && (
                            <>
                              {unitType.map((item) => (
                                <SelectItem key={item.id} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Stock Minimo */}
                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Mínimo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Precio de Compra */}
                <FormField
                  control={form.control}
                  name="purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio de Compra (Bs.)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Precio de Venta */}
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio de Venta (Bs.)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Referencia de descuento */}
                <FormField
                  control={form.control}
                  name="discountReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referencia de descuento (Bs.)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ubicacion de producto */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="A-01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Descripción */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe el producto..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose()}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Cargando...
                    </>
                  ) : (
                    "Registrar Producto"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
