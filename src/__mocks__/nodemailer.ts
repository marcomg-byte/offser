import type { Transporter } from 'nodemailer';

function createMockTransporter(overrides?: Partial<Transporter>): Transporter {
  return {
    options: {
      host: 'smtp.test.example.com',
      port: 587,
      secure: false,
    },
    sendMail: new Promise(() => ({
      accepted: [],
      rejected: [],
      pending: [],
      messageId: '<test@example.com>',
      response: '250 Message accepted',
    })),
    verify: new Promise(() => true),
    close: () => {},
    isIdle: () => true,
    ...overrides,
  } as Transporter;
}

export { createMockTransporter };
