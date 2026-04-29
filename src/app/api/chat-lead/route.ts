import { NextResponse } from "next/server";
import { Resend } from "resend";
import { forwardLeadToZailaOS } from "@/lib/zaila-os-leads";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "hello@zailaaidesigns.com";
const FROM_EMAIL =
  process.env.RESEND_FROM ?? "Zaila AI Designs <onboarding@resend.dev>";

function text(value: unknown, limit = 500) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = text(body.name, 200);
  const email = text(body.email, 200).toLowerCase();
  const business = text(body.business, 200);
  const website = text(body.website, 500);
  const primaryGoal = text(body.primaryGoal, 160);
  const urgency = text(body.urgency, 160);
  const budgetRange = text(body.budgetRange, 160);
  const conversationPath = text(body.conversationPath, 1000);
  const capturedAt = text(body.capturedAt, 120);
  const sourcePage = text(body.sourcePage, 240);
  const sourceUrl = text(body.sourceUrl, 700);
  const sourceReferrer = text(body.sourceReferrer, 700);
  const submittedFrom = text(body.submittedFrom, 120) || "chat-widget";
  const utmSource = text(body.utmSource, 160);
  const utmMedium = text(body.utmMedium, 160);
  const utmCampaign = text(body.utmCampaign, 220);
  const utmTerm = text(body.utmTerm, 220);
  const utmContent = text(body.utmContent, 220);

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Invalid email" },
      { status: 400 }
    );
  }

  if (!name || !business) {
    return NextResponse.json(
      { error: "Name and business are required" },
      { status: 400 }
    );
  }

  const projectDescription = [
    "Chatbot-qualified website inquiry.",
    primaryGoal ? `Primary goal: ${primaryGoal}` : null,
    urgency ? `Timeline: ${urgency}` : null,
    budgetRange ? `Budget: ${budgetRange}` : null,
    conversationPath ? `Conversation path: ${conversationPath}` : null,
    capturedAt ? `Captured at: ${capturedAt}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  let zailaOsSynced = false;
  try {
    zailaOsSynced = await forwardLeadToZailaOS({
      businessName: business,
      contactName: name,
      email,
      website,
      budgetRange,
      urgency,
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
    });
  } catch (syncError) {
    console.error("Chatbot ZailaOS lead sync failed:", syncError);
  }

  if (!zailaOsSynced && process.env.RESEND_API_KEY) {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Chatbot Lead: ${business || name || "New lead"}`,
      text: [
        `--- Chatbot Lead Capture ---`,
        `Name: ${name || "—"}`,
        `Email: ${email}`,
        `Business: ${business || "—"}`,
        `Website: ${website || "—"}`,
        `Goal: ${primaryGoal || "—"}`,
        `Budget: ${budgetRange || "—"}`,
        `Timeline: ${urgency || "—"}`,
        `Conversation: ${conversationPath || "—"}`,
      ].join("\n"),
      html: [
        `<h2>New Chatbot Lead</h2>`,
        `<p><strong>Name:</strong> ${escapeHtml(name || "—")}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
        `<p><strong>Business:</strong> ${escapeHtml(business || "—")}</p>`,
        `<p><strong>Website:</strong> ${escapeHtml(website || "—")}</p>`,
        `<p><strong>Goal:</strong> ${escapeHtml(primaryGoal || "—")}</p>`,
        `<p><strong>Budget:</strong> ${escapeHtml(budgetRange || "—")}</p>`,
        `<p><strong>Timeline:</strong> ${escapeHtml(urgency || "—")}</p>`,
        `<p><strong>Conversation:</strong> ${escapeHtml(conversationPath || "—")}</p>`,
      ].join(""),
    });
    if (error) {
      console.error("Chatbot lead Resend error:", error);
      return NextResponse.json({ error: "Send failed" }, { status: 500 });
    }
  } else if (!zailaOsSynced) {
    console.log("--- Chatbot Lead (no RESEND_API_KEY) ---");
    console.log(
      "Name:",
      name,
      "Email:",
      email,
      "Business:",
      business,
      "Website:",
      website,
      "Goal:",
      primaryGoal,
      "Budget:",
      budgetRange,
      "Timeline:",
      urgency,
    );
  }

  return NextResponse.json({ ok: true, zailaOsSynced });
}
