import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "./useAuth";

/**
 * 管理員權限檢查 hook
 * 確保只有 role 為 "admin" 的用戶才能訪問管理後台
 */
export function useAdminAuth() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // 等待用戶資料載入完成
    if (isLoading) return;

    // 如果未登入，重定向到首頁
    if (!user) {
      setLocation("/");
      return;
    }

    // 檢查是否為管理員（根據資料庫 role 欄位）
    if (user.role !== "admin") {
      console.warn("Unauthorized access attempt to admin panel");
      setLocation("/");
      return;
    }
  }, [user, isLoading, setLocation]);

  return {
    user,
    isLoading,
    isAdmin: user?.role === "admin",
  };
}
