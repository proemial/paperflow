"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import va from "@vercel/analytics";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useUser } from "@auth0/nextjs-auth0/client";

// https://www.npmjs.com/package/react-ga4
// https://vercel.com/docs/concepts/analytics/custom-events

export function AnalyticsClient() {
  const initialized = useGoogleAnalytics();
  const pathname = usePathname();

  useEffect(() => {
    if (initialized) {
      ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
      console.log("[AnalyticsClient] path:", pathname);
      Analytics.track(`view:${pathname === "/" ? "home" : "reader"}`, {
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
