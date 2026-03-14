const encoder = new TextEncoder();

export const SESSION_COOKIE_NAME = "samo_doc_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export type SessionPayload = {
  userId: string;
  expiresAt: number;
};

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is required to sign session cookies.");
  }

  return secret;
}

function toBase64Url(input: Uint8Array | string) {
  const buffer = Buffer.from(typeof input === "string" ? input : Buffer.from(input));
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4 || 4)) % 4;
  return Buffer.from(`${normalized}${"=".repeat(padding)}`, "base64");
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left[index] ^ right[index];
  }

  return mismatch === 0;
}

async function importKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function sign(value: string) {
  const key = await importKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return new Uint8Array(signature);
}

export async function encodeSessionToken(payload: SessionPayload) {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = await sign(encodedPayload);

  return `${encodedPayload}.${toBase64Url(signature)}`;
}

export async function decodeSessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  const [encodedPayload, encodedSignature] = token.split(".");

  if (!encodedPayload || !encodedSignature) {
    return null;
  }

  const expectedSignature = await sign(encodedPayload);
  const providedSignature = fromBase64Url(encodedSignature);

  if (!constantTimeEqual(providedSignature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload).toString("utf8")) as SessionPayload;

    if (!payload.userId || typeof payload.expiresAt !== "number" || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
