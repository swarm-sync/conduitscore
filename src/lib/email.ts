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
