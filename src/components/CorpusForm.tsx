import { type ChangeEvent } from "react";
import styled from "styled-components";

const CorpusContainer = styled.div`
  background: #ffffff;
  padding: 12px 16px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: 1px dashed #d8e1ee;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
`;

const SectionTitle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const CorpusFields = styled.div`
  display: grid;
  gap: 8px;
`;

const CorpusField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CorpusLabel = styled.label`
  font-size: 12px;
  color: #6b7280;
`;

const CorpusInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  font-size: 13px;
  background: white;
  color: #1f2937;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }
`;

const CorpusTextarea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  font-size: 13px;
  background: white;
  color: #1f2937;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
  min-height: 84px;
  resize: vertical;
  line-height: 1.5;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }
`;

const CorpusActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
`;

const CorpusHint = styled.div`
  font-size: 12px;
  color: #7a8794;
`;

const CorpusButton = styled.button`
  border: none;
  background: #0b57d0;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0a4bb8;
  }

  &:disabled {
    background: #c7d2e0;
    cursor: not-allowed;
  }
`;

const CorpusStatus = styled.div<{ $error?: boolean }>`
  margin-top: 6px;
  font-size: 12px;
  color: ${({ $error }) => ($error ? "#d14343" : "#1b7a4b")};
`;

interface CorpusFormProps {
  question: string;
  answer: string;
  saving: boolean;
  status: string;
  error: string;
  onQuestionChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAnswerChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
}

export function CorpusForm({
  question,
  answer,
  saving,
  status,
  error,
  onQuestionChange,
  onAnswerChange,
  onSubmit,
}: CorpusFormProps) {
  const canSubmit = question.trim().length > 0 && answer.trim().length > 0;

  return (
    <CorpusContainer>
      <SectionTitle>追加语料</SectionTitle>
      <CorpusFields>
        <CorpusField>
          <CorpusLabel>问题行</CorpusLabel>
          <CorpusInput
            value={question}
            onChange={onQuestionChange}
            placeholder="例如：训练营可以退款吗？"
          />
        </CorpusField>
        <CorpusField>
          <CorpusLabel>答：行</CorpusLabel>
          <CorpusTextarea
            value={answer}
            onChange={onAnswerChange}
            placeholder="例如：本训练营为线上直播形式，服务开启后不支持退费。"
          />
        </CorpusField>
      </CorpusFields>
      <CorpusActions>
        <CorpusHint>将按序号追加到 doubao-corpus.md</CorpusHint>
        <CorpusButton type="button" onClick={onSubmit} disabled={saving || !canSubmit}>
          {saving ? "写入中..." : "写入语料"}
        </CorpusButton>
      </CorpusActions>
      {(error || status) && <CorpusStatus $error={!!error}>{error || status}</CorpusStatus>}
    </CorpusContainer>
  );
}
