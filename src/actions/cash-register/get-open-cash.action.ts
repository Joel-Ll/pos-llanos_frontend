import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { cashOpenSchema } from "@/types/cash-register/cash-register.type";

export const getOpenCashAction = async () => {
  try {
    const { data } = await api.get("/cash-register/status/open");
    const response = cashOpenSchema.safeParse(data);
    if (response.success) return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.message);
  }
};
