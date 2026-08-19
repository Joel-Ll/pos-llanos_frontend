import { isAxiosError } from "axios";
import api from "@/lib/axios";
import type { Adjustment } from "@/types/adjustments/adjustments.type";

interface AdjustmentsResponse {
  data: Adjustment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const getAdjustmentsAction = async (
  page = 1,
  limit = 10
): Promise<AdjustmentsResponse> => {
  try {
    const { data } = await api.get<AdjustmentsResponse>(
      `/adjustments?page=${page}&limit=${limit}`
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.message);
    throw error;
  }
};
