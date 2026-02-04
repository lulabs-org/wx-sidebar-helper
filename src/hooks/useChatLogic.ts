import { useState } from "react";
import { streamQuestion as streamDoubaoQuestion } from "../client_doubao";
import { buildDoubaoShortPrompt, buildDoubaoLongPrompt } from "../utils/prompts";
import { getErrorMessage } from "../utils/helpers";
import { useChatHistory } from "./useChatHistory";

export function useChatLogic() {
  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingFirst, setIsLoadingFirst] = useState<boolean>(false);
  const [isLoadingSecond, setIsLoadingSecond] = useState<boolean>(false);
  const [isViewingHistory, setIsViewingHistory] = useState<boolean>(false);

  const { addHistoryItem } = useChatHistory();

  const handleConfirm = async (): Promise<void> => {
    if (question.trim() && !isLoading) {
      const q = question.trim();
      setQuestion("");
      setIsLoading(true);
      setIsLoadingFirst(true);
      setIsLoadingSecond(false);
      setAnswers([]);
      setIsViewingHistory(false);

      const collectedAnswers: string[] = [];

      try {
        const shortPrompt = buildDoubaoShortPrompt(q);
        const shortStream = await streamDoubaoQuestion(shortPrompt);
        let shortStarted = false;
        let shortHasChunk = false;
        let shortAnswer = "";

        const shortTimeoutId = setTimeout(() => {
          if (!shortHasChunk) {
            const errorMsg = "Timeout: no response from bot";
            setAnswers((prev) => [...prev, errorMsg]);
            collectedAnswers.push(errorMsg);
            setIsLoading(false);
          }
        }, 25000);

        for await (const chunk of shortStream) {
          if (!chunk) continue;
          shortHasChunk = true;
          shortAnswer += chunk;
          if (!shortStarted) {
            shortStarted = true;
            setIsLoadingFirst(false);
            setAnswers((prev) => [...prev, chunk]);
            continue;
          }
          setAnswers((prev) => {
            if (prev.length === 0) return [chunk];
            const next = [...prev];
            next[next.length - 1] = `${next[next.length - 1] ?? ""}${chunk}`;
            return next;
          });
        }
        clearTimeout(shortTimeoutId);
        setIsLoadingFirst(false);
        if (shortAnswer) {
          collectedAnswers.push(shortAnswer);
        }

        setIsLoadingSecond(true);
        const longPrompt = buildDoubaoLongPrompt(q);
        const longStream = await streamDoubaoQuestion(longPrompt);
        let longStarted = false;
        let longHasChunk = false;
        let longAnswer = "";

        const longTimeoutId = setTimeout(() => {
          if (!longHasChunk) {
            const errorMsg = "Timeout: no response from bot";
            setAnswers((prev) => [...prev, errorMsg]);
            collectedAnswers.push(errorMsg);
            setIsLoading(false);
          }
        }, 25000);

        for await (const chunk of longStream) {
          if (!chunk) continue;
          longHasChunk = true;
          longAnswer += chunk;
          if (!longStarted) {
            longStarted = true;
            setIsLoadingSecond(false);
            setAnswers((prev) => [...prev, chunk]);
            continue;
          }
          setAnswers((prev) => {
            if (prev.length === 0) return [chunk];
            const next = [...prev];
            next[next.length - 1] = `${next[next.length - 1] ?? ""}${chunk}`;
            return next;
          });
        }
        clearTimeout(longTimeoutId);
        setIsLoadingSecond(false);
        if (longAnswer) {
          collectedAnswers.push(longAnswer);
        }

        if (collectedAnswers.length > 0) {
          await addHistoryItem(q, collectedAnswers);
        }
      } catch (error) {
        const detail = getErrorMessage(error);
        console.error("Error calling chat API:", detail);
        const errorMsg = "Error: Failed to get response from bot";
        setAnswers((prev) => [...prev, errorMsg]);
        collectedAnswers.push(errorMsg);
        await addHistoryItem(q, collectedAnswers);
      } finally {
        setIsLoading(false);
        setIsLoadingFirst(false);
        setIsLoadingSecond(false);
      }
    }
  };

  return {
    question,
    setQuestion,
    answers,
    setAnswers,
    isLoading,
    isLoadingFirst,
    isLoadingSecond,
    isViewingHistory,
    setIsViewingHistory,
    handleConfirm,
  };
}
