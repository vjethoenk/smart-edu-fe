import { useMutation, useQuery } from "@tanstack/react-query";
import { roleApi, IRole } from "./api";

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await roleApi.getAll();
      return response.data;
    },
  });
};

export const useGetRoleById = (id: string) => {
  return useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      const response = await roleApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateRole = () => {
  return useMutation({
    mutationFn: (data: IRole) => roleApi.create(data),
  });
};

export const useUpdateRole = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IRole }) =>
      roleApi.update(id, data),
  });
};

export const useDeleteRole = () => {
  return useMutation({
    mutationFn: (id: string) => roleApi.delete(id),
  });
};
