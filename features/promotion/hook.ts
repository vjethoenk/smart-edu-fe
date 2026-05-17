import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promotionApi } from "./api";
import { IPromotionInput } from "@/types/api";

export const useGetPromotions = () => {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const response = await promotionApi.getPromotions();
      return response.data;
    },
  });
};

export const useGetPromotionByCode = (code: string) => {
  return useQuery({
    queryKey: ["promotion", "code", code],
    queryFn: async () => {
      const response = await promotionApi.getPromotionByCode(code);
      return response.data;
    },
    enabled: !!code,
  });
};

export const useGetPromotionsByCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["promotions", "course", courseId],
    queryFn: async () => {
      const response = await promotionApi.getPromotionsByCourse(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
};

export const useGetPromotionById = (id: string) => {
  return useQuery({
    queryKey: ["promotion", id],
    queryFn: async () => {
      const response = await promotionApi.getPromotionById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPromotionInput) => promotionApi.createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IPromotionInput> }) =>
      promotionApi.updatePromotion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      queryClient.invalidateQueries({ queryKey: ["promotion", variables.id] });
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promotionApi.deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
};
