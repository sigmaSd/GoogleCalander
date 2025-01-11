import * as path from "jsr:@std/path@1.0.8";
import { authenticate } from "npm:@google-cloud/local-auth@3.0.1";
import { google } from "npm:googleapis@144.0.0";
import { OAuth2Client } from "npm:google-auth-library";

type JSONClient = OAuth2Client & {
  credentials: {
    refresh_token?: string;
    access_token?: string;
    scope?: string;
    token_type?: string;
    expiry_date?: number;
  };
};

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.events.owned",
];
const TOKEN_PATH = path.join(Deno.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(Deno.cwd(), "credentials.json");

async function loadSavedCredentialsIfExist() {
  try {
    const content = await Deno.readTextFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch {
    return null;
  }
}

async function saveCredentials(
  client: JSONClient,
) {
  const content = await Deno.readTextFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await Deno.writeTextFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  }) as JSONClient;
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

interface EventOptions {
  summary: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[]; // Array of email addresses
}

/**
 * Creates a new event in Google Calendar
 */
export async function createEvent(options: EventOptions): Promise<string> {
  const auth = await authorize();
  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary: options.summary,
    description: options.description,
    start: {
      dateTime: options.startTime.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: options.endTime.toISOString(),
      timeZone: "UTC",
    },
    location: options.location,
    attendees: options.attendees?.map((email) => ({ email })),
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    }) as unknown as { data: { id: string } };

    return response.data.id || "";
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}
