"use server";

import { Resend } from "resend";
import { forwardLeadToZailaOS } from "@/lib/zaila-os-leads";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "hello@zailaaidesigns.com";
const FROM_EMAIL = process.env.RESEND_FROM ?? "Zaila AI Designs <onboarding@resend.dev>";

function trimFormString(formData: FormData, key: string) {
  return ((formData.get(key) as string | null) ?? "").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function submitContactForm(formData: FormData) {
  const name = trimFormString(formData, "name");
  const email = trimFormString(formData, "email");
  const project = trimFormString(formData, "project");
  const message = trimFormString(formData, "message");
  const business = trimFormString(formData, "business");
  const phone = trimFormString(formData, "phone");
  const website = trimFormString(formData, "website");
  const budgetRange = trimFormString(formData, "budgetRange");
  const urgency = trimFormString(formData, "urgency");
  const primaryGoal = trimFormString(formData, "primaryGoal");
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
    primaryGoal ? `Primary goal: ${primaryGoal}` : null,
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
      phone,
      website,
      budgetRange,
      urgency,
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
        `Phone: ${phone || "—"}`,
        `Website: ${website || "—"}`,
        `Project: ${project || "—"}`,
        `Goal: ${primaryGoal || "—"}`,
        `Budget: ${budgetRange || "—"}`,
        `Timeline: ${urgency || "—"}`,
        ``,
        `Message:`,
        message || "—",
      ].join("\n"),
      html: [
        "<p><strong>Name:</strong> " + escapeHtml(name || "—") + "</p>",
        "<p><strong>Email:</strong> " + escapeHtml(email) + "</p>",
        "<p><strong>Business:</strong> " + escapeHtml(business || "—") + "</p>",
        "<p><strong>Phone:</strong> " + escapeHtml(phone || "—") + "</p>",
        "<p><strong>Website:</strong> " + escapeHtml(website || "—") + "</p>",
        "<p><strong>Project:</strong> " + escapeHtml(project || "—") + "</p>",
        "<p><strong>Goal:</strong> " + escapeHtml(primaryGoal || "—") + "</p>",
        "<p><strong>Budget:</strong> " + escapeHtml(budgetRange || "—") + "</p>",
        "<p><strong>Timeline:</strong> " + escapeHtml(urgency || "—") + "</p>",
        "<p><strong>Message:</strong></p>",
        "<p>" + (message ? escapeHtml(message).replace(/\n/g, "<br>") : "—") + "</p>",
      ].join(""),
    });
    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: "Failed to send. Please try again or email us directly." };
    }
  } else if (!zailaOsSynced) {
    console.log("--- New Contact Form Submission (no RESEND_API_KEY; add it to receive emails) ---");
    console.log(
      "Name:",
      name,
      "Email:",
      email,
      "Business:",
      business,
      "Phone:",
      phone,
      "Website:",
      website,
      "Project:",
      project,
      "Goal:",
      primaryGoal,
      "Budget:",
      budgetRange,
      "Timeline:",
      urgency,
      "Message:",
      message,
    );
  }

  return { success: true };
}
