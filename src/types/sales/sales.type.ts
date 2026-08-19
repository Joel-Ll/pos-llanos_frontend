import { z } from "zod";

const transactionSchema = z.object({
  _id: z.string(),
  method: z.enum(["cash", "qr"]),
  amount: z.number(),
});

const SaleClientSchema = z.object({
  _id: z.string(),
  clientId: z.string(),
  name: z.string(),
  document: z.string(),
});

const saleColumnSchema = z.object({
  _id: z.string(),
  code: z.string(),
  client: SaleClientSchema,
  totalAmount: z.number(),
  transactions: z.array(transactionSchema),
  status: z.enum(["registered", "cancelled"]),
  createdAt: z.string(),
  itemsCount: z.number(),
  servicesCount: z.number(),
});

const salesSchema = z.array(saleColumnSchema);

const StatsSchema = z.object({
  totalSales: z.number(),
  totalAmount: z.number(),
  totalProfit: z.number(),
  averageTicket: z.number(),
});

export const salesResponseSchema = z.object({
  sales: salesSchema,
  stats: StatsSchema,
});

/** Formularios */
export const salesFormSchema = z.object({
  client: z.object({
    clientId: z.string().optional(),
    name: z.string().optional(),
    document: z.string().optional(),
  }),

  cashRegisterId: z.string(),

  items: z.array(
    z.object({
      productId: z.string(),
      internalCode: z.string(),
      catalogCode: z.string(),
      description: z.string(),
      brand: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      subtotal: z.number(),
    })
  ),

  services: z.array(
    z.object({
      description: z.string(),
      amount: z.number(),
      id: z.number(),
    })
  ),

  transactions: z.array(
    z.object({
      method: z.enum(["cash", "qr"]),
      amount: z.number(),
    })
  ),

  totalAmount: z.number(),
  globalDiscount: z.number(),
  notes: z.string().optional(),
});

export const saleSchema = z.object({
  _id: z.string(),
  code: z.string(),

  client: z.object({
    clientId: z.string().optional(),
    name: z.string().optional(),
    document: z.string().optional(),
    _id: z.string().optional(),
  }),

  cashRegisterId: z.string(),

  items: z.array(
    z.object({
      productId: z.string(),
      internalCode: z.string(),
      catalogCode: z.string(),
      description: z.string(),
      brand: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      subtotal: z.number(),
    })
  ),

  services: z.array(
    z.object({
      description: z.string(),
      amount: z.number(),
      _id: z.string(),
    })
  ),

  transactions: z.array(
    z.object({
      method: z.enum(["cash", "qr"]),
      amount: z.number(),
      _id: z.string().optional(),
    })
  ),

  totalAmount: z.number(),
  globalDiscount: z.number(),
  notes: z.string(),

  createdAt: z.string(),
  status: z.string(),
  profitProducts: z.number(),
  serviceIncome: z.number(),
  totalProfit: z.number(),
  updatedAt: z.string(),
});

export const quotationFormSchema = salesFormSchema.pick({
  client: true,
  items: true,
  services: true,
  globalDiscount: true,
  totalAmount: true,
});

export type Sale = z.infer<typeof saleSchema>;
export type SalesFormValues = z.infer<typeof salesFormSchema>;
export type SalesStats = z.infer<typeof StatsSchema>;
export type SaleComun = z.infer<typeof saleColumnSchema>;
export type QuotationFormValues = z.infer<typeof quotationFormSchema>;

const ClientSchema = z.object({
  clientId: z.string(),
  name: z.string(),
  document: z.string(),
  _id: z.string(),
});

const ItemSchema = z.object({
  productId: z.string(),
  internalCode: z.string(),
  catalogCode: z.string(),
  description: z.string(),
  brand: z.string(),
  quantity: z.number(),
  costPrice: z.number(),
  unitPrice: z.number(),
  subtotal: z.number(),
  profit: z.number(),
});

const ServiceSchema = z.object({
  description: z.string(),
  amount: z.number(),
  _id: z.string(),
});

const TransactionSchema = z.object({
  method: z.string(),
  amount: z.number(),
  _id: z.string(),
});

export const saleDetailSchema = z.object({
  _id: z.string(),
  code: z.string(),
  client: ClientSchema,
  cashRegisterId: z.string(),
  items: z.array(ItemSchema),
  services: z.array(ServiceSchema),
  globalDiscount: z.number(),
  totalAmount: z.number(),
  transactions: z.array(TransactionSchema),
  status: z.string(),
  profitProducts: z.number(),
  serviceIncome: z.number(),
  totalProfit: z.number(),
  notes: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type SaleDetail = z.infer<typeof saleDetailSchema>;

// Printer
export const salePrintSchema = z.object({
  code: z.string(),

  client: z.object({
    name: z.string().optional(),
    document: z.string().optional(),
  }),

  items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      subtotal: z.number(),
    })
  ),

  services: z.array(
    z.object({
      description: z.string(),
      amount: z.number(),
    })
  ),

  globalDiscount: z.number(),
  totalAmount: z.number(),

  transactions: z.array(
    z.object({
      method: z.enum(["cash", "qr"]),
      amount: z.number(),
    })
  ),

  notes: z.string().optional(),

  createdAt: z.string(),
});

export type SaleToPrint = z.infer<typeof salePrintSchema>;
