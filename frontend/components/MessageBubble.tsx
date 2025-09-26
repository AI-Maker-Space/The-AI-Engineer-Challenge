import { User, Bot, CheckCircle2, Circle } from "lucide-react";
import { Message, McqChoice } from "@/types";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const mcq = message.mcq;
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`flex max-w-[80%] space-x-3 ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        <div
          className={`rounded-lg px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : message.isError
              ? "bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 border border-red-200 dark:border-red-800"
              : "bg-card text-card-foreground border border-border"
          }`}
        >
          <div className="message-content">
            {mcq ? (
              <div className="space-y-3">
                <div className="font-medium">{mcq.question}</div>
                <div className="space-y-2">
                  {mcq.choices.map((c: McqChoice) => {
                    const isChosen = selected === c.label;
                    const reveal = selected !== null;
                    const isCorrect = reveal && mcq.correct === c.label;
                    const isIncorrect = reveal && isChosen && mcq.correct !== c.label;
                    return (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => setSelected((prev) => (prev ? prev : c.label))}
                        disabled={selected !== null}
                        className={`w-full text-left px-3 py-2 rounded-md border transition-colors flex items-center gap-2 ${
                          isCorrect
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : isIncorrect
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-border hover:bg-accent"
                        }`}
                      
                      >
                        {reveal ? (
                          isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground" />
                          )
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="font-medium mr-2">{c.label})</span>
                        <span>{c.text}</span>
                      </button>
                    );
                  })}
                </div>
                {selected !== null && (
                  <div className="mt-2 text-sm space-y-2">
                    <div>
                      <span className="font-semibold">Correct answer:</span> {mcq.correct}
                    </div>
                    {mcq.rationale && (
                      <div>
                        <span className="font-semibold">Rationale:</span> {mcq.rationale}
                      </div>
                    )}
                    {mcq.evidence && (
                      <div className="border-l-2 border-border pl-3 italic text-muted-foreground">
                        {mcq.evidence}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                {message.content}
                {message.isStreaming && (
                  <span className="typing-indicator ml-1"></span>
                )}
              </>
            )}
          </div>

          <div
            className={`text-xs mt-2 opacity-70 ${
              isUser ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

