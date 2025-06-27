import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  const baseProps = {
    apiKey: "test-key",
    onApiKeyChange: vi.fn(),
    developerPrompt: "prompt",
    onDeveloperPromptChange: vi.fn(),
  };

  it("renders with sidebar open by default", () => {
    render(<Sidebar {...baseProps} />);
    expect(screen.getByText(/OpenAI API Key/i)).toBeInTheDocument();
    expect(screen.getByText(/Developer Prompt/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close configuration sidebar/i })).toBeInTheDocument();
  });

  it("toggles sidebar open/close", () => {
    render(<Sidebar {...baseProps} />);
    const toggleButton = screen.getByRole("button", { name: /close configuration sidebar/i });
    fireEvent.click(toggleButton);
    expect(screen.getByRole("button", { name: /open configuration sidebar/i })).toBeInTheDocument();
  });

  it("calls onApiKeyChange when API key input changes", () => {
    render(<Sidebar {...baseProps} />);
    const input = screen.getByPlaceholderText("Enter your OpenAI API key");
    fireEvent.change(input, { target: { value: "new-key" } });
    expect(baseProps.onApiKeyChange).toHaveBeenCalledWith("new-key");
  });

  it("calls onDeveloperPromptChange when developer prompt changes", () => {
    render(<Sidebar {...baseProps} />);
    const textarea = screen.getByPlaceholderText("Enter your developer prompt...");
    fireEvent.change(textarea, { target: { value: "new prompt" } });
    expect(baseProps.onDeveloperPromptChange).toHaveBeenCalledWith("new prompt");
  });

  it("sidebar opens if apiKey is cleared", () => {
    const { rerender } = render(<Sidebar {...baseProps} />);
    const toggleButton = screen.getByRole("button", { name: /close configuration sidebar/i });
    fireEvent.click(toggleButton);
    rerender(<Sidebar {...baseProps} apiKey="" />);
    expect(screen.getByRole("button", { name: /close configuration sidebar/i })).toBeInTheDocument();
  });
});