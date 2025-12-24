import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { ApiRequestOptions } from "@/services/api";

export function useApiQuery<T>(
  endpoint: string,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn"> & {
    apiOptions?: ApiRequestOptions;
  }
) {
  const { apiOptions, ...queryOptions } = options || {};
  const queryKey = [endpoint, apiOptions?.requireAuth ?? true];

  return useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      return apiClient.get<T>(endpoint, apiOptions);
    },
    ...queryOptions,
  });
}

export function useApiMutation<TData = unknown, TVariables = unknown>(
  endpoint: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn"> & {
    apiOptions?: ApiRequestOptions;
  }
) {
  const { apiOptions, ...mutationOptions } = options || {};

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      switch (method) {
        case "POST":
          return apiClient.post<TData>(endpoint, variables, apiOptions);
        case "PUT":
          return apiClient.put<TData>(endpoint, variables, apiOptions);
        case "PATCH":
          return apiClient.patch<TData>(endpoint, variables, apiOptions);
        case "DELETE":
          return apiClient.delete<TData>(endpoint, apiOptions);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    },
    ...mutationOptions,
  });
}
