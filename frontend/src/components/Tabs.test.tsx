import { render, screen, fireEvent } from "@testing-library/react";
import Tabs from "./Tabs";
import React from "react";

describe("Tabs", () => {
  const tabs = [
    { label: "Tab 1", id: "tab1", content: <div>Content 1</div> },
    { label: "Tab 2", id: "tab2", content: <div>Content 2</div> },
  ];

  it("renders tab labels and default content", () => {
    render(<Tabs tabs={tabs} defaultTabId="tab1" />);
    expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 2" })).toBeInTheDocument();
    expect(screen.getByText("Content 1")).toBeVisible();
    expect(screen.queryByText("Content 2")).not.toBeVisible();
  });

  it("switches tab on click", () => {
    render(<Tabs tabs={tabs} defaultTabId="tab1" />);
    fireEvent.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(screen.getByText("Content 2")).toBeVisible();
    expect(screen.queryByText("Content 1")).not.toBeVisible();
  });

  it("switches tab with keyboard arrows", () => {
    render(<Tabs tabs={tabs} defaultTabId="tab1" />);
    const tablist = screen.getByRole("tablist");
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByText("Content 2")).toBeVisible();
    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(screen.getByText("Content 1")).toBeVisible();
  });

  it("sets correct ARIA attributes", () => {
    render(<Tabs tabs={tabs} defaultTabId="tab1" />);
    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    const tab2 = screen.getByRole("tab", { name: "Tab 2" });
    expect(tab1).toHaveAttribute("aria-selected", "true");
    expect(tab2).toHaveAttribute("aria-selected", "false");
    fireEvent.click(tab2);
    expect(tab1).toHaveAttribute("aria-selected", "false");
    expect(tab2).toHaveAttribute("aria-selected", "true");
  });
});