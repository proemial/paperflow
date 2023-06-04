"use client";

import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";
import posthog from 'posthog-js'
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";

export function AnalyticsClient() {
    const initialized = useAnalytics();
    const pathname = usePathname();

    useEffect(() => {
        if(initialized) {
            posthog.capture('path', { property: pathname });
            ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
            console.log('[AnalyticsClient] path ', pathname);
        }
    }, [initialized, pathname])

    return <Analytics />;
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