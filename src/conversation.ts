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

// Add this function to create and inject the progress bar
export function createProgressBar(): HTMLDivElement {
  const progressBarContainer = document.createElement("div");
  progressBarContainer.id = "chatgpt-backup-progress-container";
  progressBarContainer.style.position = "fixed";
  progressBarContainer.style.bottom = "10px";
  progressBarContainer.style.right = "10px";
  progressBarContainer.style.backgroundColor = "#ffffff";
  progressBarContainer.style.border = "1px solid #ccc";
  progressBarContainer.style.padding = "10px";
  progressBarContainer.style.borderRadius = "5px";
  progressBarContainer.style.zIndex = "10000";
  progressBarContainer.style.color = "#000";
  progressBarContainer.innerHTML = `
    <div>
      <div><span id="chatgpt-backup-total-offsets">TOTAL OFFSETS: 0</span></div>
      <div><span id="chatgpt-backup-requested-messages">REQUESTED MESSAGES: 0</span></div>
      <div><span id="chatgpt-backup-total-messages">TOTAL MESSAGES: 0</span></div>
    </div>
    <div style="display: flex; align-items: center; margin-top: 5px;">
      <span>Backup Progress:</span>
      <div style="flex-grow: 1; margin-left: 10px; height: 10px; background-color: #eee; border-radius: 5px;">
        <div id="chatgpt-backup-progress" style="height: 100%; width: 0%; background-color: #4caf50; border-radius: 5px;"></div>
      </div>
      <span id="chatgpt-backup-percentage" style="margin-left: 10px;">0%</span>
      <span id="chatgpt-backup-offset" style="margin-left: 10px;">OFFSET: 0</span>
    </div>
  `;
  document.body.appendChild(progressBarContainer);
  return progressBarContainer;
}

// Update the logProgress function to update the progress bar
export function logProgress(
  requested: number,
  processed: number,
  offset: number
): void {
  const progress = Math.round((processed / requested) * 100);
  const progressBar = document.getElementById("chatgpt-backup-progress");
  const percentageText = document.getElementById("chatgpt-backup-percentage");
  const offsetText = document.getElementById("chatgpt-backup-offset");

  if (progressBar && percentageText && offsetText) {
    progressBar.style.width = `${progress}%`;
    percentageText.textContent = `${progress}%`;
    offsetText.textContent = `OFFSET: ${offset}`;
  }
}
