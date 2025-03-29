import { Client, Account, Databases, Messaging, ID, Storage } from "node-appwrite";

// COOKIES
export const SESSION_COOKIE = "ework-session";

// Appwrite client
const client = new Client()
  .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT)
  .setKey(import.meta.env.APPWRITE_KEY);

// Export the services you need
export const databases = new Databases(client)
export const storage = new Storage(client)

// Admin client, used to create new accounts
export function createAdminClient() {
  const client = new Client()
    .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT)
    .setKey(import.meta.env.APPWRITE_KEY);

  // Return the services you need
  return {
    get account() {
      return new Account(client);
    },
  };
}

// Session client, used to make applications on behalf of the logged in user
export function createSessionClient(request) {
  const client = new Client()
    .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT);

  // Get the session cookie from the request and set the session
  const cookies = parseCookies(request.headers.get("cookie") ?? "");
  const session = cookies.get(SESSION_COOKIE);
  if (!session) {
    throw new Error("Session cookie not found");
  }

  client.setSession(session);

  // Return the services you need
  return {
    get account() {
      return new Account(client);
    },
  };
}

const messaging = new Messaging(client)

export async function sendEmail(subject, html) {

  const message = await messaging.createEmail(
    ID.unique(),                // messageId (unique)
    subject,        // subject
    html,    // content (puede ser HTML o texto)
    [],                         // topics (si los usas)
    [import.meta.env.PUBLIC_EMAIL_USER_ID], // users => array con emails, userIDs o phone
    [],                         // targets
    [],                         // cc
    [],                         // bcc
    [],                         // attachments (IDs de archivos en Appwrite)
    false,                      // draft
    true                        // html => true si `content` es HTML
    // scheduledAt => p.ej. "2025-03-15T10:00:00Z" para programar envío
  );
  return message;
}

// Helper function to parse cookies
function parseCookies(cookies) {
  const map = new Map();
  for (const cookie of cookies.split(";")) {
    const [name, value] = cookie.split("=");
    map.set(name.trim(), value ?? null);
  }
  return map;
}
