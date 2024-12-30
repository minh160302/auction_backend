import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    status?: number;
}

// Success response middleware
export const successMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const originalJson = res.json;
    res.json = function (data: any) {
        if (!data.error) {
            return originalJson.call(this, {
                success: true,
                data,
            });
        }
        else {
            return originalJson.call(this, {
                success: false,
                error: data.error
            });
        }
    };
    next();
};

// Error handling middleware
export const errorMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.status || 500;

    const errorResponse = {
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            status: statusCode
        }
    };

    res.status(statusCode).json(errorResponse);
};