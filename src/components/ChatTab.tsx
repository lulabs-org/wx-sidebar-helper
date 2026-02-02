import { Fragment, type ChangeEvent, type KeyboardEvent, type SyntheticEvent } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import loadingIconUrl from "../assets/loading.png";
import { AnswersContainer, AnswerItem, SendIcon, LoadingNotice, LoadingIcon } from "./styled";

const QuestionDisplay = styled.div`
  background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);
  padding: 14px 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid #e8eef7;
  border-left: 3px solid #1890ff;
  box-shadow: 0 2px 10px rgba(24, 144, 255, 0.08);
  
  strong {
    color: #0b57d0;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
    margin-bottom: 8px;
  }
  
  .question-text {
    color: #1f2937;
    font-size: 14px;
    line-height: 1.6;
    font-weight: 500;
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: flex-start;
  position: sticky;
  bottom: 0;
  z-index: 2;
  background: #ffffff;
`;

const QuestionInput = styled.textarea`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #333;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  min-height: 42px;
  max-height: 126px;
  resize: none;
  line-height: 1.5;
  font-family: inherit;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
  }

  &::placeholder {
    color: #334155;
    font-size: 13px;
  }

  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }
`;

const SendLink = styled.a`
  color: #0b57d0;
  text-decoration: none;
  font-weight: 600;
  align-self: center;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

interface ChatTabProps {
  question: string;
  answers: string[];
  isViewingHistory: boolean;
  isLoadingFirst: boolean;
  isLoadingSecond: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onQuestionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onCopyAnswer: (e: SyntheticEvent<HTMLDivElement>) => Promise<void>;
  onBackToNewChat: () => void;
  children?: React.ReactNode;
}

export function ChatTab({
  question,
  answers,
  isViewingHistory,
  isLoadingFirst,
  isLoadingSecond,
  textareaRef,
  onQuestionChange,
  onKeyPress,
  onSend,
  onCopyAnswer,
  onBackToNewChat,
  children,
}: ChatTabProps) {
  return (
    <>
      <AnswersContainer>
        {isViewingHistory && question && (
          <QuestionDisplay>
            <strong>问题</strong>
            <div className="question-text">{question}</div>
          </QuestionDisplay>
        )}

        {isLoadingFirst && answers.length === 0 && (
          <LoadingNotice>
            <span>正在加载第一个回答</span>
            <LoadingIcon src={loadingIconUrl} alt="loading" />
          </LoadingNotice>
        )}

        {answers.map((answer, index) => (
          <Fragment key={index}>
            <AnswerItem>
              <div className="answer-text">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
              </div>
              <div
                className="icon-wrapper"
                role="button"
                title="复制该回答"
                tabIndex={0}
                onClick={onCopyAnswer}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onCopyAnswer(e);
                  }
                }}
              >
                <SendIcon />
              </div>
            </AnswerItem>

            {index === 0 && isLoadingFirst && (
              <LoadingNotice>
                <span>正在加载第一个回答</span>
                <LoadingIcon src={loadingIconUrl} alt="loading" />
              </LoadingNotice>
            )}
            {index === 0 && isLoadingSecond && (
              <LoadingNotice>
                <span>正在加载第二个回答</span>
                <LoadingIcon src={loadingIconUrl} alt="loading" />
              </LoadingNotice>
            )}
          </Fragment>
        ))}
      </AnswersContainer>

      {isViewingHistory && (
        <InputContainer>
          <SendLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBackToNewChat();
            }}
            style={{ margin: "0 auto", textAlign: "center", width: "100%" }}
          >
            返回新对话
          </SendLink>
        </InputContainer>
      )}

      {!isViewingHistory && (
        <>
          {children}
          <InputContainer>
            <QuestionInput
              ref={textareaRef}
              placeholder="Ask complex questions (Enter to send)"
              value={question}
              onChange={onQuestionChange}
              onKeyDown={onKeyPress}
              rows={1}
            />
            <SendLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSend();
              }}
            >
              Send
            </SendLink>
          </InputContainer>
        </>
      )}
    </>
  );
}
