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

// Example: replace IDs with human-readable names.
// Swap this out for an async fetch if needed.
const labelResolvers: Record<
  string,
  (segment: string) => string | Promise<string>
> = {
  // For numeric IDs under /projects/:id -> "Project #123" (or fetched name)
  projects: (seg) => seg, // placeholder for folder, next segment resolves ID
  users: (seg) => seg,
};

async function defaultResolver(segment: string): Promise<string> {
  // Title-case fallback: "my-project" -> "My Project"
  return segment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

// Example async resolver registry for specific positions
// You can key by path prefix to customize per route.
async function resolveLabel(
  pathParts: string[],
  index: number,
): Promise<string> {
  const seg = pathParts[index];

  // Example: if previous segment is "projects" and this segment looks like an ID, fetch name
  const prev = index > 0 ? pathParts[index - 1] : "";
  if (prev === "projects" && /^\d+$/.test(seg ?? "")) {
    // Replace with real fetch: await getProjectName(seg)
    return `Project #${seg}`;
  }
  if (prev === "users" && /^[a-f0-9-]{6,}$/.test(seg ?? "")) {
    // Replace with real fetch: await getUserName(seg)
    return `User ${seg?.slice(0, 6)}`;
  }

  // Default fallback
  return defaultResolver(seg ?? "");
}

type DynamicBreadcrumbProps = {
  // Optionally override home label/href
  home?: { label?: string; href?: string };
  // Optionally hide certain segments (e.g., "app")
  hide?: (segment: string, index: number, parts: string[]) => boolean;
  // Optionally override href building
  hrefBuilder?: (parts: string[], index: number) => string;
};

export function DynamicBreadcrumb({
  home = { label: "Dashboard", href: "/dashboard" },
  hide,
  hrefBuilder,
}: DynamicBreadcrumbProps) {
  const pathname = usePathname();

  // Guard for root
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

  const parts = pathname.split("/").filter(Boolean);

  const [labels, setLabels] = React.useState<string[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const resolved = [];
      for (let i = 0; i < parts.length; i++) {
        if (hide && hide(parts[i] ?? "", i, parts)) {
          resolved.push(""); // placeholder, will be skipped
          continue;
        }
        resolved.push(await resolveLabel(parts, i));
      }
      if (mounted) setLabels(resolved);
    })();
    return () => {
      mounted = false;
    };
  }, [pathname]);

  function defaultHrefBuilder(ps: string[], idx: number) {
    return "/" + ps.slice(0, idx + 1).join("/");
  }

  const buildHref = hrefBuilder ?? defaultHrefBuilder;

  const visibleIndices = parts
    .map((seg, i) => ({ seg, i }))
    .filter(({ seg, i }) => !(hide && hide(seg, i, parts)))
    .map(({ i }) => i);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={home.href ?? "/"}>{home.label ?? "Home"}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {visibleIndices.map((i, idx) => {
          const isLast = idx === visibleIndices.length - 1;
          const href = buildHref(parts, i);
          const label = labels[i] ?? parts[i];

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
