import { sendEmail } from "../lib/resend";
import { ThrowdownEngine, type Mailer } from "./engine";
import { MysqlUow } from "./mysql-uow";

const publicBase =
  process.env.THROWDOWN_PUBLIC_URL ||
  process.env.FRONTEND_URL ||
  "http://localhost:3000";

export const throwdownMailer: Mailer = {
  async sendOtp(email, code) {
    await sendEmail({
      to: email,
      subject: "Your Espresso Throwdown sign-in code",
      text: `Your one-time sign-in code is ${code}. It expires in 10 minutes.\n\nIf you did not request this, you can ignore the email.`,
    });
  },
  async sendInvite(email, url, role, eventName) {
    await sendEmail({
      to: email,
      subject: `You're invited to ${eventName}`,
      text: `You have been invited as ${role.replace("_", " ")} for ${eventName}.\n\nAccept the invitation:\n${url}\n\nThis link is single-purpose and expires. It cannot be used for a different role.`,
    });
  },
};

export function createEngine(uow = new MysqlUow()) {
  return new ThrowdownEngine(uow, throwdownMailer, { now: () => new Date() }, publicBase.replace(/\/throwdown\/?$/, ""));
}

export async function runThrowdown<T>(fn: (engine: ThrowdownEngine) => Promise<T>): Promise<T> {
  const uow = new MysqlUow();
  return uow.transaction((tx) => fn(createEngine(tx)));
}
