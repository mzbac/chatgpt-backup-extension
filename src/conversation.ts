interface RawConversation {
  title: string;
  create_time: string;
  mapping: any;
}

interface Message {
  role: string;
  content: any;
  model: string;
  create_time: string;
}

interface ParsedConversation {
  messages: Message[];
  create_time: string;
  title: string;
}

export function parseConversation(
  rawConversation: RawConversation
): ParsedConversation {
  const title = rawConversation.title;
  const create_time = rawConversation.create_time;
  const mapping = rawConversation.mapping;
  const keys = Object.keys(mapping);
  const messages = [];

  for (const k of keys) {
    const msgPayload = mapping[k];
    const msg = msgPayload.message;
    if (!msg) continue;

    const role = msg.author.role;
    const content = msg.content.parts;
    const model = msg.metadata.model_slug;
    const create_time = msg.create_time;

    messages.push({
      role,
      content,
      model,
      create_time,
    });
  }

  return {
    messages,
    create_time,
    title,
  };
}

export function getRequestCount(
  total: number,
  startOffset: number,
  stopOffset: number
): number {
  if (stopOffset === -1) return total;

  return stopOffset - startOffset;
}

export function logProgress(
  total: number,
  messages: number,
  offset: number
): void {
  const progress = Math.round((messages / total) * 100);
  console.log(`GPT-BACKUP::PROGRESS::${progress}%::OFFSET::${offset}`);
}
