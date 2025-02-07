"use client";

import posthog from "posthog-js";
import { PostHogProvider } from 'posthog-js/react';
import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect } from "react";
import PostHogPageView from "./posthog/PostHogPageView"

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false,
        capture_pageleave: true,
      });
    }
  }, []);
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <PostHogProvider client={posthog}>
        <PostHogPageView />
        {children}
      </PostHogProvider>
    </ThemeProvider>
  );
}
