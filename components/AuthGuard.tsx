"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loading } from "@/components/Loading";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/giris");
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
