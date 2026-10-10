import { useQuery } from "@tanstack/react-query";
import { fetchStoresCount } from "../api/stores-count";

export const useStoresCount = () => {
  return useQuery({
    queryKey: ["stores-count"],
    queryFn: fetchStoresCount,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
