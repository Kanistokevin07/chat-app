import { useAuthInit } from "@/features/auth/hooks/useAuthInit.ts";
import { Providers } from "@/app/providers.tsx";

export default function App(){

  useAuthInit();

  return <Providers />
}