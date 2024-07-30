import { format } from "date-fns";

export function formatFirestoreTimestamp(timestamp: {
  seconds: number;
  nanoseconds: number;
}): string {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  return format(date, "MMMM dd, yyyy");
//   return format(date, "MMMM dd, yyyy h:mm:ss a");
}
