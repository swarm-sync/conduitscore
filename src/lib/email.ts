import type { Resend as ResendType } from "resend";

let _resend: ResendType | null = null;

export function getResendClient(): ResendType {
  if (!_resend) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Resend } = require("resend") as { Resend: new (key: string) => ResendType };
    _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  }
  return _resend;
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(input: SendEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    return { skipped: true };
  }

  const client = getResendClient() as ResendType & {
    emails: {
      send(payload: {
        from: string;
        to: string;
        subject: string;
        html: string;
        text: string;
      }): Promise<unknown>;
    };
  };

  return client.emails.send({
    from: (process.env.EMAIL_FROM ?? "ConduitScore <noreply@conduitscore.com>").trim(),
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}
