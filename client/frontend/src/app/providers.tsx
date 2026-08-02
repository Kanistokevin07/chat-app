import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAuthInit } from "@/features/auth/hooks/useAuthInit";

const queryClient = new QueryClient();

function AuthInitializer(){
    useAuthInit();

    return null;
}

export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
        <AuthInitializer />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}