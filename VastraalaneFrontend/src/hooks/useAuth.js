import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";

export function useHydrateAuth() {
  const token = useAuthStore((state) => state.accessToken);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const query = useQuery({
    queryKey: ["auth-me"],
    queryFn: authService.me,
    enabled: Boolean(token),
    retry: false,
  });

  useEffect(() => {
    if (query.data?.item && token) {
      setSession({ user: query.data.item, accessToken: token });
    }
  }, [query.data, setSession, token]);

  useEffect(() => {
    if (query.isError) {
      clearSession();
    }
  }, [clearSession, query.isError]);

  return query;
}
