import { Request, Response, NextFunction } from 'express';

function errorHandler(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
};

export { errorHandler };