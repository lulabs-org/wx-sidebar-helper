export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const anyErr = error as { response?: { data?: unknown }; message?: string };
    const detail = anyErr.response?.data ?? anyErr.message ?? String(error);
    return typeof detail === "string" ? detail : JSON.stringify(detail);
  }
  return String(error);
};

export const copyTextToClipboard = async (text: string): Promise<void> => {
  if (!text || !text.trim()) return;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // fallback
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.left = "-1000px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  } catch {
    // ignore
  }
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
