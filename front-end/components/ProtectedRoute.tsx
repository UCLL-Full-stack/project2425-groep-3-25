import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { isTokenValid } from "@/utils/authUtils";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isTokenValid()) {
      router.push("/login");
    }
  }, [router]);

  if (!isTokenValid()) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
};

export default ProtectedRoute;
