import doubaoCorpus from "../assets/resources/doubao-corpus.md?raw";

const normalizePromptText = (value: string): string => value.replace(/\r\n/g, "\n");

const mergePromptParts = (prefix: string, input: string): string => {
  const left = normalizePromptText(prefix).replace(/\n+$/g, "");
  const right = normalizePromptText(input).replace(/^\n+/g, "");
  if (!left) return right;
  if (!right) return left;
  return `${left}\n${right}`;
};

export const buildShortPrompt = (q: string): string => `${q}（3句话以内）`;
export const buildLongPrompt = (q: string): string => `${q}（详细回答）`;
export const buildDoubaoPrompt = (q: string): string => mergePromptParts(doubaoCorpus, q);
export const buildDoubaoShortPrompt = (q: string): string => buildDoubaoPrompt(buildShortPrompt(q));
export const buildDoubaoLongPrompt = (q: string): string => buildDoubaoPrompt(buildLongPrompt(q));
