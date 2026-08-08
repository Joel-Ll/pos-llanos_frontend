import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSelectCategory } from "@/hooks/useCategory";
import { useSelectSupplier } from "@/hooks/useSupplier";
import { zodResolver } from "@hookform/resolvers/zod";

import { getProductAction } from "@/actions/products/get-product.action";

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
import { extractPublicIdFromUrl } from "@/utils";
import { toast } from "sonner";
import { updateProductAction } from "@/actions/products/update-product.action";

export default function EditProductView() {
  const navigate = useNavigate();
  const [publicId, setPublicId] = useState<string | undefined>("");
  const [imagePreview, setImagePreview] = useState<string | undefined>("");
  const params = useParams();
  const productId = params.productId!;
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

  const { data, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductAction(productId),
    enabled: !!productId,
    retry: false,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateProductAction,
    onError: (error: TypeError) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(data);
      handleClose();
    },
  });

  useEffect(() => {
    if (data) {
      const resetData = {
        image: data.image || "",
        catalogCode: data.catalogCode || "",
        location: data.location || "",
        description: data.description || "",
        category: String(data.category?._id || data.category || ""),
        supplier: String(data.supplier?._id || data.supplier || ""),
        brand: data.brand || "",
        unidadMedida: data.unidadMedida || "",
        salePrice: data.salePrice || undefined,
        minStock: data.minStock || undefined,
        purchasePrice: data.purchasePrice || undefined,
        discountReference: data.discountReference || undefined,
      };
      setTimeout(() => {
        form.reset(resetData);
      }, 0);
    }
    setImagePreview(data?.image);
    setPublicId(extractPublicIdFromUrl(data?.image));
  }, [data, form]);

  const handleSubmit = (formData: ProductFormValues) => {
    mutate({ productId, formData });
  };

  const handleClose = () => {
    form.reset();
    navigate(-1);
  };

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div data-aos="fade-in" data-aos-duration="300">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl">
            Editar Producto
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
                {/* Código */}
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
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-auto">
                            <SelectValue
                              placeholder={
                                !field.value
                                  ? "Categoría actual Inactiva"
                                  : "Seleccionar categoría"
                              }
                            />
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
                        value={field.value}
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
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
