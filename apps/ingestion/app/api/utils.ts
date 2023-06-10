import dayjs from "dayjs";

export function dateFromParams(params: { args: string[] }) {
    return params?.args[0]
        ? dayjs().format(params?.args[0])
        : dayjs().subtract(1, 'day').format("YYYY-MM-DD");
}
