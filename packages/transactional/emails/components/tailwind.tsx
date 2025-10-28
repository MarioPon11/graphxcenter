import React from "react";
import {
  pixelBasedPreset,
  Tailwind as TailwindConfig,
} from "@react-email/components";

export const Tailwind = ({ children }: { children: React.ReactNode }) => (
  <TailwindConfig
    config={{
      presets: [pixelBasedPreset],
      theme: {
        extend: {
          colors: {
            background: "#ffffff",
            foreground: "#000000",
            primary: "#7080f9",
            "primary-foreground": "#ffffff",
            secondary: "#f0f0f0",
            "secondary-foreground": "#0a0a0a",
            accent: "#f0f0f0",
            "accent-foreground": "#0a0a0a",
            muted: "#4D5761",
            "muted-foreground": "#9da4ae",
            destructive: "#ff5555",
            "destructive-foreground": "#ffffff",
            border: "#e0e0e0",
            input: "#f0f0f0",
          },
        },
      },
    }}
  >
    {children}
  </TailwindConfig>
);
