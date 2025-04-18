import type { FirestoreTimestamps } from "@/types/general";

const firestoreTimestampsConverter = (
    firestoreTimestamp?: FirestoreTimestamps
) => {
    if (firestoreTimestamp) {
        // Extract seconds and nanoseconds
        const seconds = firestoreTimestamp.seconds;
        const nanoseconds = firestoreTimestamp.nanoseconds;

        // Create a new Date object
        // Multiply seconds by 1000 to convert to milliseconds
        // Add nanoseconds converted to milliseconds
        const date = new Date(seconds * 1000 + nanoseconds / 1000000);
        return Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    } else {
        return "No date";
    }
};

const firestoreTimestampsConverterToDate = (
    timestamp?: FirestoreTimestamps | number | Date
) => {
    if (!timestamp) {
        return undefined;
    }

    if (timestamp instanceof Date) {
        return timestamp;
    }

    if (typeof timestamp === "number") {
        return new Date(timestamp);
    }

    // Handle FirestoreTimestamps
    const seconds = timestamp.seconds;
    const nanoseconds = timestamp.nanoseconds;
    return new Date(seconds * 1000 + nanoseconds / 1000000);
};

export { firestoreTimestampsConverter, firestoreTimestampsConverterToDate };
