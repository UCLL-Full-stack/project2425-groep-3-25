import "@/styles/globals.css";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import type { AppProps } from "next/app";
import "../styles/globals.css";

const noAuthRequired = ["/login", "/signup", "/"];

function MyApp({ Component, pageProps, router }: AppProps) {
  // Check if the route does not require authentication
  const isPublicRoute = noAuthRequired.includes(router.pathname);

  return isPublicRoute ? (
    <Component {...pageProps} />
  ) : (
    <ProtectedRoute>
      <Component {...pageProps} />
    </ProtectedRoute>
  );
}

export default MyApp;
