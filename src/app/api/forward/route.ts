import { Resend } from "resend";

// Forwards every email that arrives in the zailaai.com Resend inboxes to Gmail.
// Resend calls this URL (webhook event: inbox.email.received).
// Needs RESEND_API_KEY and RESEND_WEBHOOK_SECRET in this project's environment variables.

const DESTINATION = "zailaaidesigns@gmail.com";

// Only these inboxes are forwarded: sheldondsteele@zailaai.com and marcb@zailaai.com
const FORWARDED_INBOXES = new Set([
  "3a0d3c1e-17ef-4659-9d47-783d787dcb97",
  "af6573bf-1e8a-4363-b08d-17e21b0f2632",
]);

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!apiKey || !webhookSecret) {
    return new Response("Forwarding is not configured", { status: 503 });
  }

  const resend = new Resend(apiKey);

  let event;
  try {
    event = resend.webhooks.verify({
      payload: await request.text(),
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret,
    });
  } catch {
    return new Response("Invalid webhook signature", { status: 401 });
  }

  if (
    event.type !== "inbox.email.received" ||
    !FORWARDED_INBOXES.has(event.data.inbox_id)
  ) {
    return new Response(null, { status: 204 });
  }

  const { inbox_id: inboxId, thread_id: threadId, email_id: emailId } = event.data;

  try {
    const { error } = await resend.inboxes.threads.emails.forward(
      { inboxId, threadId, emailId, to: DESTINATION },
      { idempotencyKey: `zaila-forward/${emailId}` },
    );
    if (!error) return new Response(null, { status: 204 });
    console.error("Resend forward failed", { emailId, code: error.name });
  } catch {
    console.error("Resend forward request failed", { emailId });
  }

  // Non-2xx makes Resend retry later.
  return new Response("Forwarding failed", { status: 502 });
}
