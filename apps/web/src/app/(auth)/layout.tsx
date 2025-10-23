import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="dark:from-background dark:to-background flex h-dvh w-dvw items-center justify-center bg-gradient-to-bl from-teal-100 to-orange-100">
      {children}
    </main>
  );
}
