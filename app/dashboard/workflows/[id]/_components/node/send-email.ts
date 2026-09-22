import { resend } from "@/lib/client";

export async function sendEmailNode({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html: body,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }

  return { emailId: data?.id };
}
