"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";

export function Breadcrumbs() {
  const pathname = usePathname();

  const paths = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => (
          <React.Fragment key={path}>
            <BreadcrumbItem>
              {index === 0 ? (
                <BreadcrumbPage className="capitalize">
                  {path.replace(/-/g, " ")}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={`/${paths.slice(0, index + 1).join("/")}`}
                  className="capitalize"
                >
                  {path.replace(/-/g, " ")}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < paths.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
