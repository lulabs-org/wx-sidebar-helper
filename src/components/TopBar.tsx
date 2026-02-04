import styled from "styled-components";
import { ReloadOutlined } from "@ant-design/icons";

const TopBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 4px 8px 10px;
  border-bottom: 1px solid #eef2f6;
  margin-bottom: 10px;
`;

const FlexSpacer = styled.div`
  flex: 1;
`;

const RefreshButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a9aa9;

  &:hover {
    background: #f4f7fb;
    color: #5b6b7a;
  }
`;

const RefreshIcon = styled(ReloadOutlined)`
  font-size: 18px;
`;

const Tab = styled.button<{ $active?: boolean }>`
  border: none;
  background: transparent;
  font-size: 13px;
  color: ${({ $active }) => ($active ? "#0b57d0" : "#5b6b7a")};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  padding: 7px 8px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;

  &:hover {
    background: #f4f7fb;
  }

  &::after {
    content: "";
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 0;
    height: 2px;
    background: ${({ $active }) => ($active ? "#0b57d0" : "transparent")};
    border-radius: 2px;
  }
`;

type TabType = "Chat" | "Meeting" | "History";

interface TopBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onRefresh: () => void;
}

export function TopBar({ activeTab, onTabChange, onRefresh }: TopBarProps) {
  return (
    <TopBarContainer>
      <Tab $active={activeTab === "Chat"} onClick={() => onTabChange("Chat")}>
        Chat
      </Tab>
      <Tab $active={activeTab === "Meeting"} onClick={() => onTabChange("Meeting")}>
        Meeting
      </Tab>
      <Tab $active={activeTab === "History"} onClick={() => onTabChange("History")}>
        History
      </Tab>
      <FlexSpacer />
      <RefreshButton
        aria-label="刷新回答"
        title="刷新回答"
        onClick={onRefresh}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRefresh();
          }
        }}
      >
        <RefreshIcon />
      </RefreshButton>
    </TopBarContainer>
  );
}
