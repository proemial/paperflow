import dayjs from "dayjs";

export function dateFromParams(params: { args?: string[] }) {
    return params.args
        ? dayjs().format(params.args[0])
        : undefined;
}
