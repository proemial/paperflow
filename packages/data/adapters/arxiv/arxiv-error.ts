export class ArXivError extends Error {
    private status: number = 500;

    constructor(message: string) {
        super(
            ArXivError.parseErrorMessage(message)
        );
    }

    public static withStatus(message: string, status: number) {
        const error = new ArXivError(message);
        error.status = status;

        console.error(`ArXivError(${message}, ${status})`);

        return error;
    }

    static parseErrorMessage(message: string) {
        const expr = /<.*?>/gm;
        return message?.replace(expr, '');
    }
  }
