export type BeginStream = {
  event_type?: StreamEvent;
  query: string;
};

export type ChatHistoryResponse = {
  snapshots?: Array<ChatSnapshot>;
};

export type ChatMessage = {
  content: string;
  role: MessageRole;
  related_queries?: Array<string> | null;
  sources?: Array<SearchResult> | null;
  images?: Array<string> | null;
  is_error_message?: boolean;
  more_results?: Array<{
    title: string;
    url: string;
    screenshot_url: string;
  }> | null;
};

export type ChatRequest = {
  thread_id?: number | null;
  query: string;
  history?: Array<Message>;
  pro_search?: boolean;
};

export type ChatResponseEvent = {
  event: StreamEvent;
  data:
    | BeginStream
    | SearchResultStream
    | TextChunkStream
    | RelatedQueriesStream
    | StreamEndStream
    | FinalResponseStream
    | ErrorStream
    | MoreResultsStream;
};

export type ChatSnapshot = {
  id: number;
  title: string;
  date: string;
  preview: string;
  model_name: string;
};

export type ErrorStream = {
  event_type?: StreamEvent;
  detail: string;
};

export type FinalResponseStream = {
  event_type?: StreamEvent;
  message: string;
};

export type HTTPValidationError = {
  detail?: Array<ValidationError>;
};

export type Message = {
  content: string;
  role: MessageRole;
};

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

export type RelatedQueriesStream = {
  event_type?: StreamEvent;
  related_queries?: Array<string>;
};

export type MoreResultsStream = {
  event_type?: StreamEvent;
  more_results?: Array<any>;
};

export type SearchResult = {
  title: string;
  url: string;
  content: string;
  description: string;
};

export type SearchResultStream = {
  event_type?: StreamEvent;
  results?: Array<SearchResult>;
  images?: Array<string>;
};

export type StreamEndStream = {
  event_type?: StreamEvent;
  thread_id?: number | null;
};

export enum StreamEvent {
  BEGIN_STREAM = "begin-stream",
  SEARCH_RESULTS = "search-results",
  TEXT_CHUNK = "text-chunk",
  RELATED_QUERIES = "related-queries",
  MORE_RESULTS = "more-results",
  STREAM_END = "stream-end",
  FINAL_RESPONSE = "final-response",
  ERROR = "error",
}

export type TextChunkStream = {
  event_type?: StreamEvent;
  text: string;
};

export type ThreadResponse = {
  thread_id: number;
  messages?: Array<ChatMessage>;
};

export type ValidationError = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};
