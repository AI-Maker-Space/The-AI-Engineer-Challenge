import React, { useState, KeyboardEvent, ReactNode } from "react";

interface Tab {
  label: string;
  id: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
}

export default function Tabs({ tabs, defaultTabId }: TabsProps) {
  // Find the index of the default tab, or use 0 if not found or tabs is empty
  let defaultIndex = 0;
  if (tabs && tabs.length > 0 && defaultTabId) {
    const found = tabs.findIndex((tab) => tab.id === defaultTabId);
    defaultIndex = found >= 0 ? found : 0;
  }
  const [selected, setSelected] = useState(defaultIndex);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      setSelected((prev) => (prev + 1) % tabs.length);
    } else if (e.key === "ArrowLeft") {
      setSelected((prev) => (prev - 1 + tabs.length) % tabs.length);
    }
  };

  if (!tabs || tabs.length === 0) return null;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Main tabs"
        className="flex border-b border-gray-200 dark:border-gray-700 mb-4"
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={selected === idx}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={selected === idx ? 0 : -1}
            style={selected === idx ? {
              borderBottom: '2.5px solid var(--persian-orange)',
              color: 'var(--persian-orange)',
              background: 'transparent',
            } : {}}
            className={`px-4 py-2 font-medium focus:outline-none transition-colors border-b-2 -mb-px ${
              selected === idx
                ? ''
                : "border-transparent text-gray-600 dark:text-gray-300 hover:text-[color:var(--persian-orange)]"
            }`}
            onClick={() => setSelected(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, idx) => (
        <div
          key={tab.id}
          id={`tabpanel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={selected !== idx}
          className="focus:outline-none"
        >
          {selected === idx && tab.content}
        </div>
      ))}
    </div>
  );
}