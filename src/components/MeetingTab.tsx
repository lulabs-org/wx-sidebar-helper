import { type ChangeEvent, type KeyboardEvent, type SyntheticEvent } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import loadingIconUrl from "../assets/loading.png";
import { AnswersContainer, AnswerItem, SendIcon, LoadingNotice, LoadingIcon } from "./styled";
import type { MeetingFormState } from "../utils/meetingParser";

const MeetingForm = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
  max-height: 42vh;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
  }
`;

const MeetingField = styled.label`
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
`;

const MeetingInput = styled.input`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #333;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }
`;

const MeetingPaste = styled.textarea`
  width: 100%;
  padding: 9px 12px;
  border: 1px dashed #d7dde3;
  border-radius: 8px;
  font-size: 13px;
  background: #f8fafc;
  color: #333;
  line-height: 1.5;
  resize: vertical;
  min-height: 76px;

  &:focus {
    outline: none;
    border-color: #1890ff;
    background: #ffffff;
  }
`;

const MeetingHint = styled.div`
  font-size: 12px;
  color: #8a9aa9;
  margin-top: 2px;
`;

const MeetingGroup = styled.div`
  border: 1px solid #eef2f6;
  border-radius: 10px;
  padding: 10px;
  background: #fbfdff;
  display: grid;
  gap: 8px;
`;

const MeetingGroupTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #3b4a59;
`;

const MeetingRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 8px;
`;

const MeetingActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
`;

interface MeetingTabProps {
  meetingForm: MeetingFormState;
  meetingPaste: string;
  meetingResponse: string;
  meetingLoading: boolean;
  meetingError: string;
  onFormChange: (field: keyof MeetingFormState) => (e: ChangeEvent<HTMLInputElement>) => void;
  onPasteChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onFieldKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onCopyAnswer: (e: SyntheticEvent<HTMLDivElement>) => Promise<void>;
}

export function MeetingTab({
  meetingForm,
  meetingPaste,
  meetingResponse,
  meetingLoading,
  meetingError,
  onFormChange,
  onPasteChange,
  onFieldKeyDown,
  onCopyAnswer,
}: MeetingTabProps) {
  return (
    <>
      <MeetingForm>
        <MeetingField>
          <span>快速粘贴（可选）</span>
          <MeetingPaste
            value={meetingPaste}
            onChange={onPasteChange}
            placeholder={"链接1\n会议号1\n会议主题A\n链接2\n会议号2\n会议主题B"}
          />
          <MeetingHint>粘贴 6 行会自动填充，也支持 4 行或 2 行（每行含链接与会议号）。</MeetingHint>
        </MeetingField>
        <MeetingGroup>
          <MeetingGroupTitle>会场A（Level2&Level3）</MeetingGroupTitle>
          <MeetingRow>
            <MeetingField>
              <span>会议链接1</span>
              <MeetingInput
                value={meetingForm.link1}
                onChange={onFormChange("link1")}
                onKeyDown={onFieldKeyDown}
                placeholder="https://meeting.tencent.com/..."
              />
            </MeetingField>
            <MeetingField>
              <span>会议号1</span>
              <MeetingInput
                value={meetingForm.id1}
                onChange={onFormChange("id1")}
                onKeyDown={onFieldKeyDown}
                placeholder="例如：422-7274-0163"
              />
            </MeetingField>
          </MeetingRow>
          <MeetingField>
            <span>会议主题A</span>
            <MeetingInput
              value={meetingForm.topic1}
              onChange={onFormChange("topic1")}
              onKeyDown={onFieldKeyDown}
              placeholder="例如：结营&答疑"
            />
          </MeetingField>
        </MeetingGroup>
        <MeetingGroup>
          <MeetingGroupTitle>会场B（Level3&Level4&Level5）</MeetingGroupTitle>
          <MeetingRow>
            <MeetingField>
              <span>会议链接2</span>
              <MeetingInput
                value={meetingForm.link2}
                onChange={onFormChange("link2")}
                onKeyDown={onFieldKeyDown}
                placeholder="https://meeting.tencent.com/..."
              />
            </MeetingField>
            <MeetingField>
              <span>会议号2</span>
              <MeetingInput
                value={meetingForm.id2}
                onChange={onFormChange("id2")}
                onKeyDown={onFieldKeyDown}
                placeholder="例如：366-2659-2605"
              />
            </MeetingField>
          </MeetingRow>
          <MeetingField>
            <span>会议主题B</span>
            <MeetingInput
              value={meetingForm.topic2}
              onChange={onFormChange("topic2")}
              onKeyDown={onFieldKeyDown}
              placeholder="例如：训练营结营&项目成果展示"
            />
          </MeetingField>
        </MeetingGroup>
        <MeetingActions>
          <MeetingHint>已自动生成并实时保存到资源目录</MeetingHint>
        </MeetingActions>
      </MeetingForm>

      <AnswersContainer>
        {meetingLoading && !meetingResponse && (
          <LoadingNotice>
            <span>正在生成会议文案</span>
            <LoadingIcon src={loadingIconUrl} alt="loading" />
          </LoadingNotice>
        )}
        {meetingError && (
          <AnswerItem>
            <div className="answer-text">提示：{meetingError}</div>
          </AnswerItem>
        )}
        {meetingResponse && (
          <AnswerItem>
            <div className="answer-text">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {meetingResponse}
              </ReactMarkdown>
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
        )}
      </AnswersContainer>
    </>
  );
}
