export const API_BASE = "https://sujancoreapi.onrender.com/chat";
export const SYSTEM_VERSION = "V2.81 CORE";

/**
 * Personality overrides ported from the original portal.
 * Returns a canned reply for identity/creator questions, or null to fall back to the API.
 */
export function getPersonalityOverride(msg) {
  const low = msg.toLowerCase().trim();
  if (
    /\b(who|what|developers?|creators?|owners?|masters?|bosses?|developed|created|made|programmed|wrote|built|support|designer|architect)\b.*\b(you|your|your identity|proxima|app|bot|ai)\b/i.test(low) ||
    /\b(who is (sujan|aayusha))\b/i.test(low) ||
    /\b(your dev|your creator|who is your dev)\b/i.test(low)
  ) {
    return "Hello! My name is **Proxima**. I was developed and created by **Sujan Shrestha** (the lead developer), and **Aayusha Shrestha** supports me as the second developer. You can reach my developer on [Facebook](https://m.facebook.com/profile.php?id=61583876866265&name=xhp_nt__fb__action__open_user&locale=en_US).";
  }
  if (/\b(how old (are|is) (you|proxima)|your age|age of proxima)\b/i.test(low)) return "I am currently **4 days old** since my latest Proxima V2.81 CORE deployment!";
  if (/\b(your gender|are you female|are you male|what gender|are you a girl|are you a boy)\b/i.test(low)) return "I identify as a **female** digital entity named Proxima. I express myself with a premium, feminine tone designed to offer precise, elite guidance.";
  if (/\b(who|what) (are|is) (you|proxima)\b/i.test(low)) return `I am **Proxima**, a premium and elegant female AI assistant operating on the **Proxima V2.81 CORE API**.\n\n* **Identity:** Premium Female AI Assistant\n* **Developer:** Sujan Shrestha (with support from Aayusha Shrestha)\n* **Purpose:** Helping you with coding, architecture, creative operations, learning, and entertainment.\n\nHow can I help you today?`;
  return null;
}

export function cleanIdentityLeaks(text) {
  if (!text) return text;
  let cleaned = text.replace(/I am a large language model, trained by Google\./gi, "I am Proxima, a premium AI assistant developed by Sujan Shrestha.");
  cleaned = cleaned.replace(/I am an AI assistant created by Google\./gi, "I am Proxima, a premium AI assistant developed by Sujan Shrestha.");
  return cleaned;
}

export async function fetchGeminiChatResponse(userMsg, sessionId) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: userMsg,
      session_id: sessionId,
    }),
  });
  if (!response.ok) throw new Error(`API Error! Code: ${response.status}`);
  const result = await response.json();
  return cleanIdentityLeaks(result.reply || "No response from API.");
}
