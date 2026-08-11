import type { Sale } from "@/types/sales/sales.type";

const PRINT_SERVICE_URL = import.meta.env.VITE_PRINT_SERVICE_URL;

export const printTicketAction = async (sale: Sale): Promise<void> => {
  try {
    const res = await fetch(`${PRINT_SERVICE_URL}/print/sale`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: sale.code,
        createdAt: sale.createdAt,
        clientName: sale.client?.name,
        items: sale.items.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          subtotal: i.subtotal,
        })),
        services: sale.services ?? [],
        globalDiscount: sale.globalDiscount,
        totalAmount: sale.totalAmount,
        transactions: sale.transactions.map((t) => ({
          method: t.method,
          amount: t.amount,
        })),
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }
  } catch (error: any) {
    console.warn("[Print]", error.message);
    throw error;
  }
};
