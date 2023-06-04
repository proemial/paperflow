"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import va from '@vercel/analytics';
import { usePathname } from "next/navigation";
import posthog from 'posthog-js'
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";

// https://www.npmjs.com/package/react-ga4
// https://posthog.com/docs/getting-started/send-events
// https://vercel.com/docs/concepts/analytics/custom-events

export function AnalyticsClient() {
    const initialized = useAnalytics();
    const pathname = usePathname();

    useEffect(() => {
        if(initialized) {
            posthog.capture('path', { property: pathname });
            ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
            console.log('[AnalyticsClient] path:', pathname);
        }
    }, [initialized, pathname])

    return <VercelAnalytics />;
}

export const Analytics = {
    track: (event: string) => {
        va.track(event);

        posthog.capture(event)

        ReactGA.event({
            category: "events",
            action: event,
            // label: "your label", // optional
            // value: 99, // optional, must be a number
            // nonInteraction: true, // optional, true/false
            // transport: "xhr", // optional, beacon/xhr/image
        });
        console.log('[AnalyticsClient] event:', event);
    }
}

function useAnalytics() {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        ReactGA.initialize("G-2H4D1N8XGN");

        posthog.init('phc_risXVPD3FOcarPg3Or6kJ8mMnlR2HS3ZKcwxf0rMCr7', { 
            api_host: 'https://eu.posthog.com',
            // disable_persistence: true,
            // persistence: 'memory',
            // bootstrap: {
            //     distinctID: '[user unique id]', // (If you have it)
            // },
        });
        console.log('[AnalyticsClient] init');

        setInitialized(true);
    }, [setInitialized]);

    return initialized;
}