import { ThemeProvider } from "./theme";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@repo/ui/components/sonner";
import { NuqsProvider } from "./nuqs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <ThemeProvider>
        <NuqsProvider>{children}</NuqsProvider>
        <Toaster />
      </ThemeProvider>
    </TRPCReactProvider>
  );
}
