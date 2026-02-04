import { type ChangeEvent, type SyntheticEvent } from "react";
import styled from "styled-components";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import loadingIconUrl from "../assets/loading.png";
import { LoadingIcon } from "./styled";
import type { ChatHistoryItem } from "../hooks/useChatHistory";

const HistoryContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
`;

const HistoryTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #3b4a59;
`;

const ClearButton = styled.button`
  border: none;
  background: transparent;
  color: #8a9aa9;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f4f7fb;
    color: #d14343;
  }
`;

const HistoryFilters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
  padding: 0 4px;
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  font-size: 13px;
  background: white;
  color: #333;

  &::placeholder {
    color: #8a9aa9;
  }

  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }
`;

const SearchIcon = styled(SearchOutlined)`
  position: absolute;
  left: 12px;
  font-size: 14px;
  color: #8a9aa9;
  pointer-events: none;
`;

const TimeFilterButtons = styled.div`
  display: flex;
  gap: 6px;
`;

const TimeFilterButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  border: 1px solid ${({ $active }) => ($active ? "#1890ff" : "#e6e6e6")};
  background: ${({ $active }) => ($active ? "#e6f4ff" : "white")};
  color: ${({ $active }) => ($active ? "#1890ff" : "#5b6b7a")};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1890ff;
    background: ${({ $active }) => ($active ? "#e6f4ff" : "#f5f8fc")};
  }
`;

const HistoryListContainer = styled.div`
  flex: 1;
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

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HistoryItem = styled.div`
  background: linear-gradient(180deg, #fbfdff 0%, #ffffff 100%);
  border: 1px solid #e8eef7;
  border-left: 3px solid #0b57d0;
  border-radius: 10px;
  padding: 12px;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(11, 87, 208, 0.05);
  cursor: pointer;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(11, 87, 208, 0.15);
    transform: translateY(-1px);
    background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);
  }
`;

const HistoryItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
`;

const HistoryQuestion = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.5;
  flex: 1;
  word-break: break-word;
`;

const HistoryActions = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`;

const HistoryActionButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  color: #8a9aa9;
  transition: all 0.2s ease;

  &:hover {
    background: #f4f7fb;
    color: #5b6b7a;
  }

  &.delete:hover {
    color: #d14343;
    background: #fff1f0;
  }
`;

const HistoryAnswers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const HistoryAnswerPreview = styled.div`
  font-size: 12px;
  color: #5b6b7a;
  line-height: 1.6;
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #eef2f6;
  max-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const HistoryTimestamp = styled.div`
  font-size: 11px;
  color: #8a9aa9;
  margin-top: 6px;
`;

const HistoryEmpty = styled.div`
  font-size: 13px;
  color: #8a9aa9;
  text-align: center;
  padding: 40px 20px;
`;

const HistoryLoading = styled.div`
  font-size: 13px;
  color: #8a9aa9;
  text-align: center;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const HistoryError = styled.div`
  font-size: 13px;
  color: #d14343;
  text-align: center;
  padding: 20px;
  background: #fff1f0;
  border-radius: 8px;
  margin: 0 4px;
`;

interface HistoryTabProps {
  history: ChatHistoryItem[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  timeFilter: "all" | "today" | "week" | "month";
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTimeFilterChange: (filter: "all" | "today" | "week" | "month") => void;
  onLoadItem: (id: string, e?: SyntheticEvent) => void;
  onDeleteItem: (id: string, e: SyntheticEvent) => void;
  onClearAll: () => void;
  formatTimestamp: (timestamp: number) => string;
}

export function HistoryTab({
  history,
  isLoading,
  error,
  searchQuery,
  timeFilter,
  onSearchChange,
  onTimeFilterChange,
  onLoadItem,
  onDeleteItem,
  onClearAll,
  formatTimestamp,
}: HistoryTabProps) {
  return (
    <HistoryContainer>
      <HistoryHeader>
        <HistoryTitle>对话历史</HistoryTitle>
        {history.length > 0 && <ClearButton onClick={onClearAll}>清空全部</ClearButton>}
      </HistoryHeader>

      <HistoryFilters>
        <SearchBox>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="搜索问题..."
            value={searchQuery}
            onChange={onSearchChange}
          />
        </SearchBox>
        <TimeFilterButtons>
          <TimeFilterButton
            $active={timeFilter === "all"}
            onClick={() => onTimeFilterChange("all")}
          >
            全部
          </TimeFilterButton>
          <TimeFilterButton
            $active={timeFilter === "today"}
            onClick={() => onTimeFilterChange("today")}
          >
            今天
          </TimeFilterButton>
          <TimeFilterButton
            $active={timeFilter === "week"}
            onClick={() => onTimeFilterChange("week")}
          >
            本周
          </TimeFilterButton>
          <TimeFilterButton
            $active={timeFilter === "month"}
            onClick={() => onTimeFilterChange("month")}
          >
            本月
          </TimeFilterButton>
        </TimeFilterButtons>
      </HistoryFilters>

      {isLoading ? (
        <HistoryLoading>
          <LoadingIcon src={loadingIconUrl} alt="loading" />
          <span>加载中...</span>
        </HistoryLoading>
      ) : error ? (
        <HistoryError>{error}</HistoryError>
      ) : history.length === 0 ? (
        <HistoryEmpty>
          {searchQuery || timeFilter !== "all" ? "没有找到匹配的记录" : "暂无历史记录"}
        </HistoryEmpty>
      ) : (
        <HistoryListContainer>
          <HistoryList>
            {history.map((item) => (
              <HistoryItem key={item.id} onClick={(e) => onLoadItem(item.id, e)}>
                <HistoryItemHeader>
                  <HistoryQuestion>{item.question}</HistoryQuestion>
                  <HistoryActions>
                    <HistoryActionButton
                      className="delete"
                      onClick={(e) => onDeleteItem(item.id, e)}
                      title="删除"
                    >
                      <DeleteOutlined style={{ fontSize: 14 }} />
                    </HistoryActionButton>
                  </HistoryActions>
                </HistoryItemHeader>
                <HistoryAnswers>
                  {item.answers.map((answer, idx) => (
                    <HistoryAnswerPreview key={idx}>{answer}</HistoryAnswerPreview>
                  ))}
                </HistoryAnswers>
                <HistoryTimestamp>{formatTimestamp(item.timestamp)}</HistoryTimestamp>
              </HistoryItem>
            ))}
          </HistoryList>
        </HistoryListContainer>
      )}
    </HistoryContainer>
  );
}
