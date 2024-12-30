export class HttpError extends Error {
    status: number;

    constructor(message: string, status: number = 500) {
        super(message);
        this.name = "HttpError";
        this.status = status;

        // Maintain proper stack trace for where the error was thrown (only in V8 engines)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        }
    }
}
