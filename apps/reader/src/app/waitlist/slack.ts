import { randomArrayEntry } from "utils/array";
import base64url from "base64url";

const messages = [
    "Great news! $name has just added themselves to the Paperflow waitlist! :tada:",
    "Welcome aboard! $name is now on the Paperflow waitlist! :partying_face:",
    "Heads up! $name just secured a spot on the Paperflow waitlist! ✨",
    "Cheers! $name is the latest addition to the Paperflow waitlist! :champagne:",
    "Exciting times! $name has hopped onto the Paperflow waitlist! :rocket:",
];

function formatMessage(name: string, email: string) {
    const message = randomArrayEntry<string>(messages);
    const firstLine = message.replaceAll("$name", name);

    const secondLine = `Email: ${email}`;
    const thirdLine = `Access URL: https://paperflow.ai?token=${base64url(
        email
    )}`;

    return `${firstLine}\n• ${secondLine}\n• ${thirdLine}`;
}

export async function postToSlack(payload: {name: string, email: string}) {
    const result = await fetch("https://hooks.slack.com/services/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", {
      method: "POST",
      body: JSON.stringify({
        username: "Waitlist Bot",
        icon_emoji: "paperflow",
        text: formatMessage(payload.name, payload.email)
      }),
    });

    return await result.text();
  }
