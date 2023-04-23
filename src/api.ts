import { sleep } from "./utils";

export async function loadToken(): Promise<string> {
  const res = await fetch("https://chat.openai.com/api/auth/session");

  if (!res.ok) {
    throw new Error("failed to fetch token");
  }

  const json = await res.json();
  return json.accessToken;
}

export async function getConversationIds(token: string, offset = 0) {
  const res = await fetch(
    `https://chat.openai.com/backend-api/conversations?offset=${offset}&limit=20`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("failed to fetch conversation ids");
  }

  const json = await res.json();
  return {
    items: json.items.map((item: any) => ({ ...item, offset })),
    total: json.total,
  };
}

export async function fetchConversation(
  token: string,
  id: string,
  maxAttempts = 3,
  attempt = 1
): Promise<any> {
  const res = await fetch(
    `https://chat.openai.com/backend-api/conversation/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const exceeded = attempt >= maxAttempts;
    if (res.status === 429 && !exceeded) {
      await sleep(30000);
      return fetchConversation(token, id, maxAttempts, attempt + 1);
    } else {
      throw new Error("failed to fetch conversation");
    }
  }

  return res.json();
}
