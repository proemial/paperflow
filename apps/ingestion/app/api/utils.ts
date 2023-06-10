import dayjs from "dayjs";

export function dateFromParams(params: { date: string }) {
    return params.date
        ? dayjs().format(params.date)
        : dayjs().subtract(1, 'day').format("YYYY-MM-DD");
}
