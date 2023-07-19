"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import va from "@vercel/analytics";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useUser } from "@auth0/nextjs-auth0/client";
import * as Sentry from "@sentry/nextjs";

// https://www.npmjs.com/package/react-ga4
// https://vercel.com/docs/concepts/analytics/custom-events

export function AnalyticsClient() {
  const initialized = useGoogleAnalytics();
  const pathname = usePathname();
  useSentry();

  const getViewName = (path: string) => {
    if (path === "/") return "home";
    if (path.startsWith("/arxiv")) return "reader";
    return path.slice(1);
  };

  useEffect(() => {
    if (initialized) {
      ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
      console.log("[AnalyticsClient] ", `view:${getViewName(pathname)}`);
      Analytics.track(`view:${getViewName(pathname)}`, {
        path: pathname,
      });
    }
  }, [initialized, pathname]);

  return <VercelAnalytics />;
}

export const Analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    va.track(event, properties);

    ReactGA.event(event, properties);
    console.log("[AnalyticsClient] event:", event, properties);
  },
};

function useGoogleAnalytics() {
  const { user } = useUser();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user) {
      ReactGA.initialize("G-2H4D1N8XGN", {
        gaOptions: {
          userId: user.sub,
        },
      });
      console.log("[AnalyticsClient] init");

      setInitialized(true);
    }
  }, [setInitialized, user]);

  return initialized;
}

function useSentry() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      Sentry.init({
        dsn: "https://e2c9474531c243f9aae26fb24b1b8653@o4505557013168128.ingest.sentry.io/4505557015199744",
        integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
        // Performance Monitoring
        tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      });

      setInitialized(true);
    }
  }, [setInitialized]);

  return initialized;
}
