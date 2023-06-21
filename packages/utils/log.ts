import { DateMetrics } from "./date";

const logMetrics = false;

export const Log = {
    metrics: (begin: number, message: string) => {
        if(logMetrics)
            console.log(`[${DateMetrics.elapsed(begin)}] ${message}`);
    }
};
