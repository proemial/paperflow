import dayjs from "dayjs";

export function dateFromParams(params: { args?: string[] }) {
    return params.args
        ? dayjs().format(params.args[0])
        : dayjs().subtract(1, 'day').format("YYYY-MM-DD");
}

export function dateAndIndexFromParams(params: { args?: string[] }) {
    if(!params?.args || params.args.length < 2)
      throw new Error('Missing parameters!');

    const [date, indexStr] = params.args;
    const index = Number(indexStr);

    return {date, index};
}
