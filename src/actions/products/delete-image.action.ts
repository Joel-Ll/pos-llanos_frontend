import { isAxiosError } from "axios";
import api from "@/lib/axios";

export const deleteImageAction = async (publicId: string) => {
  try {
    const url = `/products/delete-image`;
    await api.delete(url, {
      params: publicId,
    });
    return true;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.message);
  }
};
