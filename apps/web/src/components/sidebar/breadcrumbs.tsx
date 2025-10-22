"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";

type DynamicBreadcrumbProps = {
  home?: { label?: string; href?: string };
  hide?: (segment: string, index: number, parts: string[]) => boolean;
  hrefBuilder?: (parts: string[], index: number) => string;
};

export function DynamicBreadcrumb({
  home = { label: "Dashboard", href: "/dashboard" },
  hide,
  hrefBuilder,
}: DynamicBreadcrumbProps) {
  const pathname = usePathname();
  const parts = React.useMemo(
    () => (pathname ?? "/").split("/").filter(Boolean),
    [pathname],
  );

  // Determine which indices are visible (respect home prefix + hide)
  const homeParts = (home.href ?? "/").split("/").filter(Boolean);
  const homePrefixMatches = homeParts.every((p, idx) => parts[idx] === p);
  const baseIndex = homePrefixMatches ? homeParts.length : 0;

  const visibleIndices = React.useMemo(
    () =>
      parts
        .map((seg, i) => ({ seg, i }))
        .filter(
          ({ seg, i }) =>
            i >= baseIndex && !(hide && hide(seg ?? "", i, parts)),
        )
        .map(({ i }) => i),
    [parts, baseIndex, hide],
  );

  const buildHref =
    hrefBuilder ??
    ((ps: string[], idx: number) => "/" + ps.slice(0, idx + 1).join("/"));

  if (!pathname || pathname === "/") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{home.label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={home.href ?? "/"}>{home.label ?? "Home"}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {visibleIndices.map((i, idx) => {
          const isLast = idx === visibleIndices.length - 1;
          const href = buildHref(parts, i);
          const label = parts[i];

          return (
            <React.Fragment key={i}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="capitalize">
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
