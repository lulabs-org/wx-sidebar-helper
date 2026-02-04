import { useState, type ChangeEvent } from "react";
import { getErrorMessage } from "../utils/helpers";

export function useCorpusLogic() {
  const [doubaoEntry, setDoubaoEntry] = useState<{ question: string; answer: string }>({
    question: "",
    answer: "",
  });
  const [doubaoSaving, setDoubaoSaving] = useState<boolean>(false);
  const [doubaoStatus, setDoubaoStatus] = useState<string>("");
  const [doubaoError, setDoubaoError] = useState<string>("");

  const handleDoubaoEntryChange =
    (field: "question" | "answer") =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const value = e.target.value;
      setDoubaoEntry((prev) => ({ ...prev, [field]: value }));
      setDoubaoStatus("");
      setDoubaoError("");
    };

  const handleDoubaoEntrySubmit = async (): Promise<void> => {
    if (doubaoSaving) return;
    const questionText = doubaoEntry.question.replace(/\r\n/g, "\n").trim();
    const answerText = doubaoEntry.answer.replace(/\r\n/g, "\n").trim();
    if (!questionText || !answerText) {
      setDoubaoError("请填写问题与答案");
      return;
    }

    setDoubaoSaving(true);
    setDoubaoError("");
    setDoubaoStatus("");

    try {
      const res = await fetch("/api/doubao-corpus-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText, answer: answerText }),
      });
      let payload: { index?: number; error?: string } | null = null;
      try {
        payload = await res.json();
      } catch {
        payload = null;
      }
      if (!res.ok) {
        const detail = payload?.error ?? `HTTP ${res.status}`;
        throw new Error(detail);
      }
      const savedIndex = typeof payload?.index === "number" ? payload.index : null;
      setDoubaoStatus(savedIndex === null ? "已写入" : `已写入：${savedIndex}`);
      setDoubaoEntry({ question: "", answer: "" });
    } catch (error) {
      setDoubaoError(getErrorMessage(error));
    } finally {
      setDoubaoSaving(false);
    }
  };

  return {
    doubaoEntry,
    doubaoSaving,
    doubaoStatus,
    doubaoError,
    handleDoubaoEntryChange,
    handleDoubaoEntrySubmit,
  };
}
