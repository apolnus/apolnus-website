import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

export function useAuth() {
  const { data: user, isLoading, refetch } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false
  });

  const login = () => {
    // Redirect to the login page where user chooses provider
    const currentUrl = window.location.href;
    window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
  };

  const logout = () => {
    // Use the global logout endpoint which handles cookie clearing and redirect
    window.location.href = "/api/auth/logout";
  };

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user, isLoading]);
}
