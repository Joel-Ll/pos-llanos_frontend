import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { saleSchema, type SalesFormValues } from "@/types/sales/sales.type";

export const registerSaleAction = async (formData: SalesFormValues) => {
  try {
    const url = "/sales";
    const { data } = await api.post(url, formData);
    console.log(data);
    const result = saleSchema.safeParse(data);
    if (result.success) return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.message);
  }
};
