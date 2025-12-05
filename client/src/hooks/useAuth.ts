import { trpc } from "@/lib/trpc";

export function useAuth() {
  const { data: user, isLoading, refetch } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      refetch();
      window.location.href = "/";
    },
  });

  const login = () => {
    const currentUrl = window.location.href;
    window.location.href = `/api/oauth/login?redirect=${encodeURIComponent(currentUrl)}`;
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
