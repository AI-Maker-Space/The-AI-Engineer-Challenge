import { render, screen, fireEvent } from "@testing-library/react";
import ChatPanel, { ChatMessage } from "./ChatPanel";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

describe("ChatPanel", () => {
  const baseProps = {
    chatHistory: [] as ChatMessage[],
    userInput: "",
    onInputChange: vi.fn(),
    onSend: vi.fn(),
    loading: false,
  };

  it("renders empty chat state", () => {
    render(<ChatPanel {...baseProps} />);
    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type your message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("renders chat history", () => {
    const chatHistory: ChatMessage[] = [
      { role: "user", content: "Hello!" },
      { role: "assistant", content: "Hi there!" },
    ];
    render(<ChatPanel {...baseProps} chatHistory={chatHistory} />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });

  it("calls onInputChange when typing", () => {
    const onInputChange = vi.fn();
    render(<ChatPanel {...baseProps} onInputChange={onInputChange} />);
    fireEvent.change(screen.getByLabelText(/type your message/i), { target: { value: "test" } });
    expect(onInputChange).toHaveBeenCalledWith("test");
  });

  it("calls onSend when form is submitted", () => {
    const onSend = vi.fn();
    render(<ChatPanel {...baseProps} userInput="hi" onSend={onSend} />);
    fireEvent.submit(screen.getByRole("form"));
    expect(onSend).toHaveBeenCalled();
  });

  it("disables input and button when loading", () => {
    render(<ChatPanel {...baseProps} loading={true} userInput="hi" />);
    expect(screen.getByLabelText(/type your message/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });
});