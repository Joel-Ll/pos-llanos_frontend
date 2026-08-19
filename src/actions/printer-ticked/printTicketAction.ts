import type { SaleToPrint } from "@/types/sales/sales.type";

const PRINT_SERVICE_URL = import.meta.env.VITE_PRINT_SERVICE_URL;

export const printTicketAction = async (sale: SaleToPrint): Promise<void> => {
  try {
    const res = await fetch(`${PRINT_SERVICE_URL}/print/sale`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sale),
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
