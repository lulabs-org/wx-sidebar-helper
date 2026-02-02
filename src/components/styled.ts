import styled, { keyframes } from "styled-components";
import { CopyOutlined } from "@ant-design/icons";

export const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 360px;
  height: 100vh;
  padding: 12px;
  overflow: hidden;
  background: #ffffff;
  border-radius: 0 14px 14px 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #eef2f6;
  border-left: none;
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

export const AnswersContainer = styled.div`
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding-right: 4px;
  margin-right: -4px;
  flex: 1 1 auto;

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

  &::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
`;

export const AnswerItem = styled.div`
  background: linear-gradient(180deg, #fbfdff 0%, #ffffff 100%);
  padding: 14px 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid #e8eef7;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 10px rgba(245, 196, 83, 0.05);
  border-left: 3px solid #f4d06f;

  &:hover {
    border-color: #fde68a;
    box-shadow: 0 6px 16px rgba(245, 196, 83, 0.18);
    transform: translateY(-1px);
    background: linear-gradient(180deg, #fff7e6 0%, #ffffff 100%);
  }

  .answer-text {
    color: #1f2937;
    font-size: 14px;
    line-height: 1.7;
    flex: 1;
    margin-right: 16px;
    padding: 2px 0;
    word-break: break-word;
    white-space: normal;

    h1, h2, h3 {
      color: #0f172a;
      font-weight: 600;
      margin: 8px 0 6px;
      line-height: 1.3;
    }
    h1 { font-size: 16px; }
    h2 { font-size: 15px; }
    h3 { font-size: 14px; }

    p { margin: 6px 0; }
    ul, ol { margin: 6px 0 6px 18px; }
    li { margin: 4px 0; }

    a {
      color: #0b57d0;
      text-decoration: none;
    }
    a:hover { text-decoration: underline; }

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      background: #f3f5f7;
      border: 1px solid #e6e8eb;
      border-radius: 6px;
      padding: 0 4px;
      font-size: 13px;
      color: #0f172a;
    }
    pre {
      background: #0f172a;
      color: #e6edf3;
      border-radius: 10px;
      padding: 10px 12px;
      overflow: auto;
      border: 1px solid #0b1b35;
    }
    pre code {
      background: transparent;
      border: none;
      color: inherit;
      padding: 0;
      font-size: 13px;
    }

    blockquote {
      background: #f8fafc;
      border-left: 3px solid #e0e7ff;
      color: #334155;
      margin: 8px 0;
      padding: 6px 10px;
      border-radius: 6px;
    }
    hr {
      border: none;
      border-top: 1px dashed #e5e7eb;
      margin: 10px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 6px 8px;
      text-align: left;
    }
    th {
      background: #f3f6fb;
      color: #0f172a;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 8px 0;
      border-radius: 6px;
    }
  }

  .icon-wrapper {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    transition: all 0.2s ease;
    margin-top: 2px;
    cursor: pointer;
    background: #f5fbff;
    border: 1px solid #e6f4ff;
    box-shadow: 0 1px 2px rgba(11, 87, 208, 0.06);

    &:hover {
      background: #e6f4ff;
      box-shadow: 0 2px 6px rgba(11, 87, 208, 0.12);
      transform: translateY(-1px);
    }
  }
`;

export const LoadingNotice = styled.div`
  color: #68707a;
  font-size: 13px;
  margin: -6px 0 10px 0;
  padding-left: 2px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const LoadingIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  opacity: 0.85;
  animation: ${spin} 1.2s linear infinite;
  transform-origin: center;
`;

export const SendIcon = styled(CopyOutlined)`
  color: #1890ff;
  font-size: 16px;
  opacity: 0.8;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    opacity: 1;
  }
`;
