import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";

interface TopicSelectorProps {
  topics: string[];
  selectedTopic: string | null;
  onSelect: (topic: string | null) => void;
}

export default function TopicSelector({
  topics,
  selectedTopic,
  onSelect,
}: TopicSelectorProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const filtered = useMemo(() => {
    if (!query.trim()) return topics;
    const q = query.toLowerCase();
    return topics.filter((t) => t.toLowerCase().includes(q));
  }, [topics, query]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(-1);
  }, [open, query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && ["ArrowDown", "Enter"].includes(e.key)) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const choice = filtered[activeIndex] ?? filtered[0];
      if (choice) {
        onSelect(choice);
        setOpen(false);
        setQuery("");
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Topic</label>

      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTopic ? selectedTopic : "Search topics..."}
          className="w-full pl-9 pr-10 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
          aria-expanded={open}
          aria-haspopup="listbox"
        />
        {selectedTopic && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            aria-label="Clear selected topic"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {!selectedTopic && (
          <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
        )}

        {open && (
          <div className="absolute z-10 mt-2 w-full rounded-md border border-border bg-popover shadow-lg max-h-64 overflow-auto">
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">No topics found.</div>
            ) : (
              <ul ref={listRef} role="listbox" className="py-1">
                {filtered.map((topic, idx) => {
                  const isSelected = selectedTopic === topic;
                  const isActive = idx === activeIndex;
                  return (
                    <li key={topic}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          onSelect(isSelected ? null : topic);
                          setOpen(false);
                          setQuery("");
                        }}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-accent"
                            : isSelected
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        }`}
                      >
                        {topic}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {selectedTopic && (
        <div className="flex items-center flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs bg-accent text-foreground">
            {selectedTopic}
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="p-0.5 hover:opacity-80"
              aria-label="Clear selected topic"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
