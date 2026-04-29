"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "hello@zailaaidesigns.com";
const FROM_EMAIL = process.env.RESEND_FROM ?? "Zaila AI Designs <onboarding@resend.dev>";

type ZailaOsLeadPayload = {
  businessName: string;
  contactName: string;
  email: string;
  projectDescription: string;
  budgetRange?: string;
  urgency?: string;
  sourcePage?: string;
  sourceUrl?: string;
  sourceReferrer?: string;
  submittedFrom?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  website_url?: string;
};

function trimFormString(formData: FormData, key: string) {
  return ((formData.get(key) as string | null) ?? "").trim();
}

function getZailaOsInboundUrl() {
  const explicitUrl = process.env.ZAILA_OS_INBOUND_URL?.trim();
  if (explicitUrl) return explicitUrl;

  const baseUrl = process.env.ZAILA_OS_BASE_URL?.trim();
  if (!baseUrl) return null;

  try {
    return new URL("/api/leads/inbound", baseUrl).toString();
  } catch {
    console.error("Invalid ZAILA_OS_BASE_URL.");
    return null;
  }
}

async function forwardLeadToZailaOS(payload: ZailaOsLeadPayload) {
  const inboundUrl = getZailaOsInboundUrl();
  if (!inboundUrl) {
    console.log("ZailaOS lead sync skipped: set ZAILA_OS_BASE_URL or ZAILA_OS_INBOUND_URL.");
    return false;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const secret = process.env.ZAILA_OS_INBOUND_SECRET?.trim();
  if (secret) {
    headers["x-zaila-inbound-secret"] = secret;
  }

  const response = await fetch(inboundUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(result?.error ?? `ZailaOS returned ${response.status}.`);
  }

  return true;
}

export async function submitContactForm(formData: FormData) {
  const name = trimFormString(formData, "name");
  const email = trimFormString(formData, "email");
  const project = trimFormString(formData, "project");
  const message = trimFormString(formData, "message");
  const business = trimFormString(formData, "business");
  const honeypot = trimFormString(formData, "website_url");
  const sourcePage = trimFormString(formData, "sourcePage");
  const sourceUrl = trimFormString(formData, "sourceUrl");
  const sourceReferrer = trimFormString(formData, "sourceReferrer");
  const submittedFrom = trimFormString(formData, "submittedFrom");
  const utmSource = trimFormString(formData, "utmSource");
  const utmMedium = trimFormString(formData, "utmMedium");
  const utmCampaign = trimFormString(formData, "utmCampaign");
  const utmTerm = trimFormString(formData, "utmTerm");
  const utmContent = trimFormString(formData, "utmContent");

  if (honeypot) {
    return { success: true };
  }

  if (!email || !email.includes("@")) {
    return { success: false, error: "Please provide a valid email address." };
  }

  if (!name || !business || !message) {
    return { success: false, error: "Please fill in your name, business, and project details." };
  }

  const projectDescription = [
    project ? `Project type: ${project}` : null,
    message,
  ]
    .filter(Boolean)
    .join("\n\n");

  let zailaOsSynced = false;
  try {
    zailaOsSynced = await forwardLeadToZailaOS({
      businessName: business,
      contactName: name,
      email,
      projectDescription,
      sourcePage,
      sourceUrl,
      sourceReferrer,
      submittedFrom,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      website_url: honeypot,
    });
  } catch (syncError) {
    console.error("ZailaOS lead sync failed:", syncError);
  }

  if (!zailaOsSynced && process.env.RESEND_API_KEY) {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Contact: ${business || name || "New inquiry"}`,
      text: [
        `Name: ${name || "—"}`,
        `Email: ${email}`,
        `Business: ${business || "—"}`,
        `Project: ${project || "—"}`,
        ``,
        `Message:`,
        message || "—",
      ].join("\n"),
      html: [
        "<p><strong>Name:</strong> " + (name || "—") + "</p>",
        "<p><strong>Email:</strong> " + email + "</p>",
        "<p><strong>Business:</strong> " + (business || "—") + "</p>",
        "<p><strong>Project:</strong> " + (project || "—") + "</p>",
        "<p><strong>Message:</strong></p>",
        "<p>" + (message ? message.replace(/\n/g, "<br>") : "—") + "</p>",
      ].join(""),
    });
    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: "Failed to send. Please try again or email us directly." };
    }
  } else if (!zailaOsSynced) {
    console.log("--- New Contact Form Submission (no RESEND_API_KEY; add it to receive emails) ---");
    console.log("Name:", name, "Email:", email, "Business:", business, "Project:", project, "Message:", message);
  }

  return { success: true };
}
