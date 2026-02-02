import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent, type SyntheticEvent } from "react";
import { Container } from "./components/styled";
import { TopBar } from "./components/TopBar";
import { ChatTab } from "./components/ChatTab";
import { MeetingTab } from "./components/MeetingTab";
import { HistoryTab } from "./components/HistoryTab";
import { CorpusForm } from "./components/CorpusForm";
import { useChatLogic } from "./hooks/useChatLogic";
import { useMeetingLogic } from "./hooks/useMeetingLogic";
import { useCorpusLogic } from "./hooks/useCorpusLogic";
import { useChatHistory } from "./hooks/useChatHistory";
import { copyTextToClipboard, formatTimestamp } from "./utils/helpers";
import "./App.css";

type TabType = "Chat" | "Meeting" | "History";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("Chat");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Chat logic
  const {
    question,
    setQuestion,
    answers,
    setAnswers,
    isLoadingFirst,
    isLoadingSecond,
    isViewingHistory,
    setIsViewingHistory,
    handleConfirm,
  } = useChatLogic();

  // Meeting logic
  const {
    meetingForm,
    meetingPaste,
    meetingResponse,
    meetingLoading,
    meetingError,
    updateMeetingForm,
    handleMeetingPaste,
    handleMeetingFieldKeyDown,
  } = useMeetingLogic();

  // Corpus logic
  const {
    doubaoEntry,
    doubaoSaving,
    doubaoStatus,
    doubaoError,
    handleDoubaoEntryChange,
    handleDoubaoEntrySubmit,
  } = useCorpusLogic();

  // History logic
  const {
    history,
    isLoading: historyLoading,
    error: historyError,
    deleteHistoryItem,
    clearHistory,
    searchAndFilter,
  } = useChatHistory();

  const [historySearchQuery, setHistorySearchQuery] = useState<string>("");
  const [historyTimeFilter, setHistoryTimeFilter] = useState<"all" | "today" | "week" | "month">("all");

  // Auto-adjust textarea height
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null): void => {
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(42, textarea.scrollHeight), 126);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight(textareaRef.current);
  }, [question]);

  // History search
  const handleHistorySearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHistorySearchQuery(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      searchAndFilter(value, historyTimeFilter);
    }, 300);
  };

  // History time filter
  const handleTimeFilter = (filter: "all" | "today" | "week" | "month") => {
    setHistoryTimeFilter(filter);
    searchAndFilter(historySearchQuery, filter);
  };

  // Load history item
  const loadHistoryItem = (id: string, e?: SyntheticEvent): void => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const item = history.find((h) => h.id === id);
    if (item) {
      setAnswers(item.answers);
      setActiveTab("Chat");
      setQuestion(item.question);
      setIsViewingHistory(true);
    }
  };

  // Delete history item
  const handleDeleteHistoryItem = (id: string, e: SyntheticEvent): void => {
    e.stopPropagation();
    deleteHistoryItem(id);
  };

  // Refresh answers
  const handleRefresh = (): void => {
    setAnswers([]);
    setIsViewingHistory(false);
  };

  // Focus input
  const focusHeroInput = (e?: SyntheticEvent): void => {
    try {
      if (e && typeof (e as any).preventDefault === "function") {
        (e as any).preventDefault();
      }
    } catch {}
    const el = textareaRef.current;
    if (el) {
      el.focus();
      try {
        const len = (el.value || "").length;
        el.setSelectionRange(len, len);
      } catch {}
      try {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch {}
    }
  };

  // Copy answer
  const handleCopyAnswer = async (e: SyntheticEvent<HTMLDivElement>): Promise<void> => {
    try {
      const parent = e.currentTarget?.parentElement;
      const textEl = parent?.querySelector?.(".answer-text") as HTMLElement | null;
      const text = ((textEl?.innerText ?? textEl?.textContent) ?? "").trim();
      await copyTextToClipboard(text);
    } catch {
      // ignore
    }
  };

  // Back to new chat
  const handleBackToNewChat = (): void => {
    setIsViewingHistory(false);
    setAnswers([]);
    setQuestion("");
    setTimeout(() => {
      focusHeroInput();
    }, 100);
  };

  // Input handlers
  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Container>
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} onRefresh={handleRefresh} />

      {activeTab === "History" ? (
        <HistoryTab
          history={history}
          isLoading={historyLoading}
          error={historyError}
          searchQuery={historySearchQuery}
          timeFilter={historyTimeFilter}
          onSearchChange={handleHistorySearch}
          onTimeFilterChange={handleTimeFilter}
          onLoadItem={loadHistoryItem}
          onDeleteItem={handleDeleteHistoryItem}
          onClearAll={clearHistory}
          formatTimestamp={formatTimestamp}
        />
      ) : activeTab === "Meeting" ? (
        <MeetingTab
          meetingForm={meetingForm}
          meetingPaste={meetingPaste}
          meetingResponse={meetingResponse}
          meetingLoading={meetingLoading}
          meetingError={meetingError}
          onFormChange={updateMeetingForm}
          onPasteChange={handleMeetingPaste}
          onFieldKeyDown={handleMeetingFieldKeyDown}
          onCopyAnswer={handleCopyAnswer}
        />
      ) : (
        <ChatTab
          question={question}
          answers={answers}
          isViewingHistory={isViewingHistory}
          isLoadingFirst={isLoadingFirst}
          isLoadingSecond={isLoadingSecond}
          textareaRef={textareaRef}
          onQuestionChange={handleInput}
          onKeyPress={handleKeyPress}
          onSend={handleConfirm}
          onCopyAnswer={handleCopyAnswer}
          onBackToNewChat={handleBackToNewChat}
        >
          <CorpusForm
            question={doubaoEntry.question}
            answer={doubaoEntry.answer}
            saving={doubaoSaving}
            status={doubaoStatus}
            error={doubaoError}
            onQuestionChange={handleDoubaoEntryChange("question")}
            onAnswerChange={handleDoubaoEntryChange("answer")}
            onSubmit={handleDoubaoEntrySubmit}
          />
        </ChatTab>
      )}
    </Container>
  );
}

export default App;
