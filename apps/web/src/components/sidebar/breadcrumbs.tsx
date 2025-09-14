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
import { api } from "@/trpc/react";

function titleCase(segment: string) {
  return segment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

type UseBreadcrumbLabelsArgs = {
  parts: string[];
  hide?: (segment: string, index: number, parts: string[]) => boolean;
};

function useBreadcrumbLabels({ parts, hide }: UseBreadcrumbLabelsArgs) {
  // Use a single query to get all rooms we need, avoiding conditional hooks
  const roomsQuery = api.rooms.list.useQuery(undefined);

  // Build labels
  const labels = React.useMemo(() => {
    const out: string[] = [];
    const roomsData = roomsQuery.data ?? [];

    for (let i = 0; i < parts.length; i++) {
      if (hide && hide(parts[i] ?? "", i, parts)) {
        out.push("");
        continue;
      }
      const prev = i > 0 ? parts[i - 1] : "";
      const seg = parts[i] ?? "";

      if (prev === "rooms") {
        // Find the room data for this segment
        const room = roomsData.find((r) => r.id === seg);
        out.push(room?.name ?? seg);
        continue;
      }

      // Default
      out.push(titleCase(seg));
    }
    return out;
  }, [parts, hide, roomsQuery.data]);

  const isLoading = roomsQuery.isLoading;

  return { labels, isLoading };
}

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

  const { labels } = useBreadcrumbLabels({ parts, hide });

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
          const label = labels[i] || parts[i];

          return (
            <React.Fragment key={i}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
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
