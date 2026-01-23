import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { capitalizeString } from '../utils/index.js';

function errorHandler(
    value: {
        error: Error | ZodError;
        title?: string;
    },
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    const { error, title: errorTitle } = value;
    
    if (error instanceof ZodError) {
        const title = 'Request Validation Errors';
        const errorInfo = {
            title,
            cause: error?.cause,
            issues: error.issues,
            message: error.message,
            name: error.name,
            stack: error?.stack,
            type: error.type
        };
        console.error(`❌ ${title}:`);
        console.dir(errorInfo, { depth: 5, colors: true });
        return res.status(400).json({ title, ...errorInfo });
    }

    if (error instanceof Error) {
        const title = capitalizeString(errorTitle || 'Internal Server Error');
        const errorInfo = {
            cause: error?.cause,
            message: error.message,
            name: error.name,
            stack: error?.stack
        };
        console.error(`❌ ${title}:`);
        console.dir(errorInfo, { depth: 5, colors: true });
        return res.status(500).json({ title, ...errorInfo });
    }

    const title = errorTitle || 'Unknown Error';
    console.error(`❌ ${title}:`);
    console.error(error);
    return res.status(500).json({ title, message: 'An unknown error occurred.', error });

};

export { errorHandler };