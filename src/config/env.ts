function required(name: string): string {
    const value = process.env[name];

    if(!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export const env = {
    PORT: Number(process.env.PORT ?? 3000),
    SMTP_HOST: required('SMTP_HOST'),
    SMTP_PORT: Number(required('SMTP_PORT')),
    SMTP_USER: required('SMTP_USER'),
    SMTP_PASS: required('SMTP_PASS'),
    MAIL_FROM: required('MAIL_FROM')
}