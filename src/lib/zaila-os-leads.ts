export type ZailaOsLeadPayload = {
  businessName: string;
  contactName: string;
  email: string;
  projectDescription: string;
  phone?: string;
  website?: string;
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

export function getZailaOsInboundUrl() {
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

export async function forwardLeadToZailaOS(payload: ZailaOsLeadPayload) {
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
