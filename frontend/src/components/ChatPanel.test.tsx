import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import ChatPanel, { ChatMessage } from "./ChatPanel";

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

describe("ChatPanel", () => {
  const baseProps = {
    chatHistory: [] as ChatMessage[],
    userInput: "",
    onInputChange: vi.fn(),
    onSend: vi.fn(),
    loading: false,
    onClearChat: vi.fn(),
    clearChatDisabled: false,
    renderAssistantHtml: false,
  };

  it("renders empty chat state", () => {
    render(<ChatPanel {...baseProps} />);
    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type your message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("renders chat history with user and assistant", () => {
    const chatHistory: ChatMessage[] = [
      { role: "user", content: "Hello!" },
      { role: "assistant", content: "Hi there!" },
    ];
    render(<ChatPanel {...baseProps} chatHistory={chatHistory} />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });

  it("calls onInputChange when typing", () => {
    render(<ChatPanel {...baseProps} />);
    fireEvent.change(screen.getByLabelText(/type your message/i), { target: { value: "test" } });
    expect(baseProps.onInputChange).toHaveBeenCalledWith("test");
  });

  it("calls onSend when form is submitted", () => {
    render(<ChatPanel {...baseProps} userInput="hi" />);
    fireEvent.submit(screen.getByRole("form"));
    expect(baseProps.onSend).toHaveBeenCalled();
  });

  it("disables input and button when loading", () => {
    render(<ChatPanel {...baseProps} loading={true} userInput="hi" />);
    expect(screen.getByLabelText(/type your message/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  it("calls onClearChat when clear chat button is clicked", () => {
    render(<ChatPanel {...baseProps} userInput="hi" onClearChat={baseProps.onClearChat} />);
    const clearButton = screen.getByRole("button", { name: /clear chat/i });
    fireEvent.click(clearButton);
    expect(baseProps.onClearChat).toHaveBeenCalled();
  });

  it("disables clear chat button when clearChatDisabled is true", () => {
    render(<ChatPanel {...baseProps} clearChatDisabled={true} onClearChat={baseProps.onClearChat} />);
    expect(screen.getByRole("button", { name: /clear chat/i })).toBeDisabled();
  });

  it("renders assistant message as HTML when renderAssistantHtml is true", () => {
    const chatHistory: ChatMessage[] = [
      { role: "assistant", content: "<b>Bold!</b>" },
    ];
    render(<ChatPanel
      {...baseProps}
      chatHistory={chatHistory}
      renderAssistantHtml={true}
    />);
    expect(screen.getByText("Bold!")).toBeInTheDocument();
  });
});