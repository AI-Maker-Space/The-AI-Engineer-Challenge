export interface Message {
  id: string;
  role: "user" | "assistant" | "developer";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isError?: boolean;
  mcq?: McqPayload;
}

export interface McqChoice {
  label: string;
  text: string;
}

export interface McqPayload {
  question: string;
  choices: McqChoice[];
  correct: string; // label like 'A'
  rationale?: string;
  evidence?: string;
  userSelection?: string; // label selected by user
  section?: string;
}
