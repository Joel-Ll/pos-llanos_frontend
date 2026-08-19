import { routeMetadata } from "@/types/route";
import type { SaleDetail, SaleToPrint } from "@/types/sales/sales.type";

export const getThumbnailUrl = (url: string, width = 100, height = 100) => {
  if (!url.includes("cloudinary")) return url;

  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`
  );
};

export const formatDate = (isoDateString: Date): string => {
  const formatDate = isoDateString.toLocaleString("es-BO", {
    timeZone: "America/La_Paz",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formatDate;
};

export function extractPublicIdFromUrl(url: string | undefined): string {
  if (url) {
    const parts = url.split("/");
    const uploadIndex = parts.findIndex((part) => part === "upload");
    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL");
    }

    const publicIdParts = parts.slice(uploadIndex + 2);
    let publicId = publicIdParts.join("/");
    publicId = publicId.replace(/\.[^/.]+$/, "");
    return publicId;
  }
  return "";
}

export const formatCurrency = (amout: number): string => {
  return new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amout);
};

export function generateUniqueId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export const getCurrentPage = (pathname: string) => {
  return routeMetadata.find((route) => pathname.startsWith(route.startsWith));
};

export const mapSaleToPrint = (sale: SaleDetail): SaleToPrint => ({
  code: sale.code,

  client: {
    name: sale.client.name,
    document: sale.client.document,
  },

  items: sale.items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal,
  })),

  services: sale.services.map((service) => ({
    description: service.description,
    amount: service.amount,
  })),

  globalDiscount: sale.globalDiscount,
  totalAmount: sale.totalAmount,

  transactions: sale.transactions.map((transaction) => ({
    method: transaction.method as "cash" | "qr",
    amount: transaction.amount,
  })),

  notes: sale.notes,
  createdAt: sale.createdAt,
});
