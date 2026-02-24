"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "zailaaidesigns@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM ?? "Zaila AI Designs <onboarding@resend.dev>";

export async function submitContactForm(formData: FormData) {
  const name = (formData.get("name") as string) ?? "";
  const email = (formData.get("email") as string) ?? "";
  const project = (formData.get("project") as string) ?? "";
  const message = (formData.get("message") as string) ?? "";
  const business = (formData.get("business") as string) ?? "";

  if (!email || !email.includes("@")) {
    return { success: false, error: "Please provide a valid email address." };
  }

  if (process.env.RESEND_API_KEY) {
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
  } else {
    console.log("--- New Contact Form Submission (no RESEND_API_KEY; add it to receive emails) ---");
    console.log("Name:", name, "Email:", email, "Business:", business, "Project:", project, "Message:", message);
  }

  return { success: true };
}
