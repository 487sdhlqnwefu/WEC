import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL || "tristan@worldespressochampionship.com";
const adminEmail = process.env.ADMIN_EMAIL || "tristan@worldespressochampionship.com";

if (!apiKey || apiKey.includes("your_resend_api_key")) {
  console.warn("⚠️ RESEND_API_KEY not configured. Emails will be logged to console only.");
}

const resend = apiKey && !apiKey.includes("your_resend_api_key")
  ? new Resend(apiKey)
  : null;

export function isEmailEnabled(): boolean {
  return !!resend;
}

// ─── Email Templates ───────────────────────────────────────────

export async function sendRegistrationNotification(data: {
  type: string;
  fullName: string;
  email: string;
  country: string;
}) {
  const subject = `New WEC Registration: ${data.fullName} (${data.type})`;
  const body = `
A new registration has been submitted for WEC 2026 Panama.

Type: ${data.type.toUpperCase()}
Name: ${data.fullName}
Email: ${data.email}
Country: ${data.country}

View all registrations in the admin dashboard.
  `;

  await sendEmail({ to: adminEmail, subject, text: body });
}

export async function sendRegistrationConfirmation(data: {
  type: string;
  fullName: string;
  email: string;
}) {
  const subject = `WEC 2026 Registration Received — ${data.fullName}`;
  const body = `
Hi ${data.fullName},

Thank you for registering as a ${data.type} for WEC 2026 Panama!

We have received your application and will review it shortly. You will hear from us within 5 business days.

Event Details:
- Date: 26 October 2026
- Location: Panama City, Panama

If you have any questions, reply to this email or contact us at tristan@worldespressochampionship.com

Best regards,
The WEC Team
  `;

  await sendEmail({ to: data.email, subject, text: body });
}

export async function sendSponsorInquiryNotification(data: {
  companyName: string;
  contactName: string;
  email: string;
  tier: string;
}) {
  const subject = `New Sponsor Inquiry: ${data.companyName} (${data.tier})`;
  const body = `
A new sponsorship inquiry has been submitted.

Company: ${data.companyName}
Contact: ${data.contactName}
Email: ${data.email}
Tier: ${data.tier.toUpperCase()}

View all inquiries in the admin dashboard.
  `;

  await sendEmail({ to: adminEmail, subject, text: body });
}

export async function sendSponsorConfirmation(data: {
  companyName: string;
  contactName: string;
  email: string;
}) {
  const subject = `WEC Sponsorship Inquiry Received — ${data.companyName}`;
  const body = `
Hi ${data.contactName},

Thank you for your interest in sponsoring the World Espresso Championship 2026!

We have received your inquiry and our sponsorship team will be in touch within 3 business days to discuss the details.

In the meantime, you can learn more about WEC at https://worldespressochampionship.com

Best regards,
The WEC Team
  `;

  await sendEmail({ to: data.email, subject, text: body });
}

export async function sendContactNotification(data: {
  type: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const emailSubject = `New Contact Form: ${data.name} (${data.type})`;
  const body = `
A new message has been submitted via the contact form.

Type: ${data.type.toUpperCase()}
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject || "N/A"}

Message:
${data.message}
  `;

  await sendEmail({ to: adminEmail, subject: emailSubject, text: body });
}

export async function sendContactConfirmation(data: {
  name: string;
  email: string;
}) {
  const subject = `We received your message — WEC`;
  const body = `
Hi ${data.name},

Thank you for reaching out to the World Espresso Championship team!

We have received your message and will respond as soon as possible (typically within 2 business days).

Best regards,
The WEC Team
  `;

  await sendEmail({ to: data.email, subject, text: body });
}

export async function sendOrganiserNotification(data: {
  fullName: string;
  email: string;
  country: string;
}) {
  const subject = `New National Organiser Application: ${data.fullName} (${data.country})`;
  const body = `
A new national organiser application has been submitted.

Name: ${data.fullName}
Email: ${data.email}
Country: ${data.country}

View all applications in the admin dashboard.
  `;

  await sendEmail({ to: adminEmail, subject, text: body });
}

// ─── Generic Send Helper ───────────────────────────────────────

async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  if (!resend) {
    // Log to console when Resend is not configured
    console.log(`\n📧 EMAIL (not sent — Resend not configured):\nTo: ${to}\nSubject: ${subject}\n${text}\n`);
    return;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      text,
    });
    console.log(`✅ Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
  }
}
