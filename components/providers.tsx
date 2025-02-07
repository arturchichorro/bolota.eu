"use client";

import posthog from "posthog-js"
import { PostHogProvider } from 'posthog-js/react'
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

if (typeof window !== 'undefined') {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (posthogKey) {
        posthog.init(posthogKey, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
          person_profiles: "identified_only",
          loaded: (posthog) => {
            if (process.env.NODE_ENV === "development") posthog.debug();
          },
        });
      } else {
        console.error("PostHog key is not defined");
      }
  }

export function Providers({ children }: { children: ReactNode }) {
    return (
        <PostHogProvider client={posthog}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
            </ThemeProvider>
        </PostHogProvider>
    )
}
