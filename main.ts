// Usage example:
import { createEvent } from "./lib.ts";

// Create an event
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
