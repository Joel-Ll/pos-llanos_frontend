import { z } from "zod";
import { productSchema } from "../products/products.type";

export const adjustmentSchema = z.object({
  _id: z.string(),
  product: productSchema.pick({
    internalCode: true,
    catalogCode: true,
    description: true,
    brand: true,
  }),
  adjustmentType: z.string(),
  quantity: z.number(),
  reason: z.string(),
  previousStock: z.number(),
  newStock: z.number(),
  note: z.string(),
  createdAt: z.string(),
});
export type Adjustment = z.infer<typeof adjustmentSchema>;

/** Formularios */
export const adjustmentsFormSchema = z.object({
  product: z.string().min(1, "El producto es requerido"),
  adjustmentType: z.enum(
    ["increment", "decrement"],
    "Debe seleccionar un tipo de ajuste"
  ),
  quantity: z.number("La cantidad es requerida").gte(0, "Número no válido"),
  reason: z.string().min(1, "El motivo es requerido"),
  note: z.string().optional(),
});

export type AdjustmentsFormValues = z.infer<typeof adjustmentsFormSchema>;
