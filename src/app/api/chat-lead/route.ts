import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "zailaaidesigns@gmail.com";
const FROM_EMAIL =
  process.env.RESEND_FROM ?? "Zaila AI Designs <onboarding@resend.dev>";

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.slice(0, 200) : "";
  const email = typeof body.email === "string" ? body.email.slice(0, 200) : "";
  const business =
    typeof body.business === "string" ? body.business.slice(0, 200) : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Invalid email" },
      { status: 400 }
    );
  }

  if (process.env.RESEND_API_KEY) {
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
      ].join("\n"),
      html: [
        `<h2>New Chatbot Lead</h2>`,
        `<p><strong>Name:</strong> ${name || "—"}</p>`,
        `<p><strong>Email:</strong> ${email}</p>`,
        `<p><strong>Business:</strong> ${business || "—"}</p>`,
      ].join(""),
    });
    if (error) {
      console.error("Chatbot lead Resend error:", error);
      return NextResponse.json({ error: "Send failed" }, { status: 500 });
    }
  } else {
    console.log("--- Chatbot Lead (no RESEND_API_KEY) ---");
    console.log("Name:", name, "Email:", email, "Business:", business);
  }

  return NextResponse.json({ ok: true });
}
