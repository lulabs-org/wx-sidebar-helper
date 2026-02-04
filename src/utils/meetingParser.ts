export type MeetingFormState = {
  link1: string;
  id1: string;
  topic1: string;
  link2: string;
  id2: string;
  topic2: string;
};

const extractMeetingPair = (line: string): [string, string] | null => {
  const urlMatch = line.match(/https?:\/\/\S+/);
  const idMatch = line.match(/\d[\d-]{6,}/);
  if (!urlMatch || !idMatch) return null;
  return [urlMatch[0], idMatch[0]];
};

export const parseMeetingPaste = (raw: string): MeetingFormState | null => {
  const lines = raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length >= 6) {
    const [link1, id1, topic1, link2, id2, topic2] = lines;
    return { link1, id1, topic1, link2, id2, topic2 };
  }

  if (lines.length >= 4) {
    const [link1, id1, link2, id2] = lines;
    return { link1, id1, topic1: "", link2, id2, topic2: "" };
  }

  if (lines.length === 2) {
    const first = extractMeetingPair(lines[0]);
    const second = extractMeetingPair(lines[1]);
    if (first && second) {
      const [link1, id1] = first;
      const [link2, id2] = second;
      return { link1, id1, topic1: "", link2, id2, topic2: "" };
    }
  }

  return null;
};
