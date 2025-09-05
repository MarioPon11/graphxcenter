import { ThemeProvider } from "./theme";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@repo/ui/components/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </TRPCReactProvider>
  );
}
