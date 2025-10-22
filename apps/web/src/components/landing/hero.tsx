import React from "react";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";

import { BackgroundPattern } from "@/components/landing/background-pattern";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { APP_DESCRIPTION, APP_NAME, APP_SUMMARY } from "@/constants";
import { Gxsio } from "@repo/icons";

export function Hero() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6">
      <BackgroundPattern />

      <Link href="/" className="flex items-center gap-2">
        <Gxsio className="size-8" />
        <span className="text-2xl font-bold">{APP_NAME}</span>
      </Link>
      <div className="relative z-10 max-w-3xl text-center">
        <Badge
          variant="secondary"
          className="border-border rounded-full py-1"
          asChild
        >
          <Link href="/dashboard">
            Just released v1.0.0 <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Badge>
        <h1 className="mt-6 text-4xl font-semibold tracking-tighter sm:text-5xl md:text-6xl md:leading-[1.2] lg:text-7xl">
          {APP_DESCRIPTION}
        </h1>
        <p className="mt-6 md:text-lg">{APP_SUMMARY}</p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full text-base" asChild>
            <Link href="/dashboard">
              <span>Get Started</span>
              <ArrowUpRight className="h-5! w-5!" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base shadow-none"
          >
            <CirclePlay className="h-5! w-5!" /> Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
