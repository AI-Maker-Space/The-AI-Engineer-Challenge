import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

interface TopicSelectorProps {
  topics: string[];
  selectedTopic: string | null;
  onSelect: (topic: string | null) => void;
}

export default function TopicSelector({ topics, selectedTopic, onSelect }: TopicSelectorProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return topics;
    const q = query.toLowerCase();
    return topics.filter((t) => t.toLowerCase().includes(q));
  }, [topics, query]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Topic</label>

      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics..."
          className="w-full pl-9 pr-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
        />
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

      <div className="max-h-64 overflow-auto rounded-md border border-border bg-card">
        {filtered.length === 0 ? (
          <div className="p-3 text-sm text-muted-foreground">No topics found.</div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <li key={topic}>
                  <button
                    type="button"
                    onClick={() => onSelect(isSelected ? null : topic)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      isSelected
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
    </div>
  );
}


