import { loadToken, getConversationIds, fetchConversation } from "./api";
import {
  parseConversation,
  getRequestCount,
  logProgress,
} from "./conversation";
import { downloadJson } from "./download";
import { generateOffsets, sleep } from "./utils";

async function getAllConversations(startOffset: number, stopOffset: number) {
  const token = await loadToken();

  const { total, items: allItems } = await getConversationIds(
    token,
    startOffset
  );
  const offsets = generateOffsets(startOffset, total);

  for (const offset of offsets) {
    if (offset === stopOffset) break;

    await sleep();

    const { items } = await getConversationIds(token, offset);
    allItems.push.apply(allItems, items);
  }

  const lastOffset =
    stopOffset === -1 ? offsets[offsets.length - 1] : stopOffset;
  const allConversations = [];
  const requested = getRequestCount(total, startOffset, stopOffset);

  console.log(`GPT-BACKUP::STARTING::TOTAL-OFFSETS::${lastOffset}`);
  console.log(`GPT-BACKUP::STARTING::REQUESTED-MESSAGES::${requested}`);
  console.log(`GPT-BACKUP::STARTING::TOTAL-MESSAGES::${total}`);

  for (const item of allItems) {
    await sleep(1000);

    if (allConversations.length % 20 === 0) {
      logProgress(requested, allConversations.length, item.offset);
    }

    const rawConversation = await fetchConversation(token, item.id);
    const conversation = parseConversation(rawConversation);
    allConversations.push(conversation);
  }

  logProgress(requested, allConversations.length, lastOffset);

  return allConversations;
}

async function main(startOffset: number, stopOffset: number) {
  const allConversations = await getAllConversations(startOffset, stopOffset);
  await downloadJson(allConversations);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadConversations") {
    const START_OFFSET = 0;
    const STOP_OFFSET = -1;
    main(START_OFFSET, STOP_OFFSET)
      .then(() => console.log("GPT-BACKUP::DONE"))
      .catch((e) => console.error(e));
  }
});
