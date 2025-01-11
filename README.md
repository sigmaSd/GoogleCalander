# Google Calendar Event Creator

A Deno library for creating events in Google Calendar using the Google Calendar API.

## Prerequisites

- [Deno](https://deno.land/) installed on your system
- A Google Cloud Project with the Calendar API enabled
- OAuth 2.0 credentials (client ID and client secret)

## Setup

1. **Create a Google Cloud Project**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Calendar API
   - Create OAuth 2.0 credentials (OAuth client ID)
   - Download the credentials and save them as `credentials.json` in the project root

2. **Install Dependencies**
   The project uses external dependencies that will be automatically downloaded when you run the application:
   ```ts
   import * as path from "jsr:@std/path@1.0.8";
   import { authenticate } from "npm:@google-cloud/local-auth@3.0.1";
   import { google } from "npm:googleapis@144.0.0";
   import { OAuth2Client } from "npm:google-auth-library";
   ```

## Project Structure

```
├── credentials.json    # Your Google OAuth credentials (not included in repo)
├── token.json         # Generated authentication token (not included in repo)
├── lib.ts             # Main library functionality
├── main.ts           # Example usage
└── README.md         # This file
```

## Usage

1. First, ensure you have your `credentials.json` file in the project root directory.

2. Create an event using the following code:

```typescript
import { createEvent } from "./lib.ts";

const eventDetails = {
  summary: "Team Meeting",
  description: "Weekly team sync-up",
  startTime: new Date("2025-01-15T10:00:00Z"),
  endTime: new Date("2025-01-15T11:00:00Z"),
  location: "Conference Room A",
  attendees: ["person1@example.com", "person2@example.com"],
};

try {
  const eventId = await createEvent(eventDetails);
  console.log("Event created with ID:", eventId);
} catch (error) {
  console.error("Failed to create event:", error);
}
```

3. Run the application:
```bash
deno run --allow-read --allow-write --allow-net main.ts
```

## Permissions Required

The application needs the following Deno permissions:
- `--allow-read`: To read credentials and token files
- `--allow-write`: To save authentication tokens
- `--allow-net`: To make API calls to Google Calendar

## API Reference

### `createEvent(options: EventOptions): Promise<string>`

Creates a new event in Google Calendar.

#### Parameters

`options: EventOptions`
- `summary`: string - The title of the event
- `description?`: string - (Optional) Description of the event
- `startTime`: Date - Start time of the event
- `endTime`: Date - End time of the event
- `location?`: string - (Optional) Location of the event
- `attendees?`: string[] - (Optional) Array of attendee email addresses

#### Returns

Returns a Promise that resolves to the created event's ID.

## Security Notes

- Keep your `credentials.json` file secure and never commit it to version control
- The `token.json` file will be generated automatically on first use
- Always use environment variables for sensitive information in production

## License

MIT
