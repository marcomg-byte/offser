const logError = (error: unknown, title?: string): void => {
    if (error instanceof Error) {
        console.error(`❌ ${title || 'Error occurred'}`);
        console.error({
            title: title || 'Error occurred',
            cause: error?.cause,
            error: error.message,
            name: error.name,
            stack: error?.stack
        });
    } else {
        console.error(`❌ ${title || 'Unknown error occurred'}`);
        console.error(error);
    }
};

export { logError };