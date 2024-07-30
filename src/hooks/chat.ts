import { useMutation } from "@tanstack/react-query";
import {
  ChatMessage,
  ChatRequest,
  ChatResponseEvent,
  ErrorStream,
  Message,
  MessageRole,
  MoreResultsStream,
  RelatedQueriesStream,
  SearchResult,
  SearchResultStream,
  StreamEndStream,
  StreamEvent,
  TextChunkStream,
} from "@/schema/chat";
import Error from "next/error";
import {
  fetchEventSource,
  FetchEventSourceInit,
} from "@microsoft/fetch-event-source";
import { useState } from "react";
import { useChatStore } from "@/stores";
import { env } from "../env.mjs";
import { useRouter } from "next/navigation";

const streamChat = async ({
  request,
  onMessage,
}: {
  request: ChatRequest;
  onMessage?: FetchEventSourceInit["onmessage"];
}): Promise<void> => {
  try {
    return await fetchEventSource("api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      openWhenHidden: true,
      body: JSON.stringify({ ...request }),
      // credentials: "include", // if need cookie
      onmessage: onMessage,
      onerror: (error) => {
        console.error(error);
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const convertToChatRequest = (query: string, history: ChatMessage[]) => {
  const newHistory: Message[] = history.map((message) => ({
    role:
      message.role === MessageRole.USER
        ? MessageRole.USER
        : MessageRole.ASSISTANT,
    content: message.content,
  }));
  return { query, history: newHistory };
};

export const useChat = () => {
  const { addMessage, messages, threadId, setThreadId } = useChatStore();

  const [streamingMessage, setStreamingMessage] = useState<ChatMessage | null>(
    null
  );
  const [isStreamingProSearch, setIsStreamingProSearch] = useState(false);
  const [isStreamingMessage, setIsStreamingMessage] = useState(false);

  const handleEvent = (eventItem: ChatResponseEvent, state: ChatMessage) => {
    switch (eventItem.event) {
      case StreamEvent.BEGIN_STREAM:
        setIsStreamingMessage(true);
        setStreamingMessage({
          ...state,
          role: MessageRole.ASSISTANT,
          content: "",
          related_queries: [],
          sources: [],
          images: [],
        });
        break;
      case StreamEvent.SEARCH_RESULTS:
        const data = eventItem.data as SearchResultStream;
        state.sources = data.results ?? [];
        state.images = data.images ?? [];
        break;
      case StreamEvent.TEXT_CHUNK:
        state.content += (eventItem.data as TextChunkStream).text;
        break;
      case StreamEvent.RELATED_QUERIES:
        state.related_queries =
          (eventItem.data as RelatedQueriesStream).related_queries ?? [];
        break;
      case StreamEvent.MORE_RESULTS:
        state.more_results =
          (eventItem.data as MoreResultsStream).more_results ?? [];
        break;
      case StreamEvent.STREAM_END:
        const endData = eventItem.data as StreamEndStream;
        addMessage({ ...state });
        setStreamingMessage(null);
        setIsStreamingMessage(false);
        setIsStreamingProSearch(false);

        // Only if the backend is using the DB
        if (endData.thread_id) {
          setThreadId(endData.thread_id);
          window.history.pushState({}, "", `/search/${endData.thread_id}`);
        }
        return;
      case StreamEvent.ERROR:
        const errorData = eventItem.data as ErrorStream;
        addMessage({
          role: MessageRole.ASSISTANT,
          content: errorData.detail,
          related_queries: [],
          sources: [],
          images: [],
          is_error_message: true,
        });
        setStreamingMessage(null);
        setIsStreamingMessage(false);
        setIsStreamingProSearch(false);
        return;
    }
    setStreamingMessage({
      role: MessageRole.ASSISTANT,
      content: state.content,
      related_queries: state.related_queries,
      sources: state.sources,
      images: state.images,
      more_results: state.more_results,
    });
  };

  const { mutateAsync: chat } = useMutation<void, Error, ChatRequest>({
    retry: false,
    mutationFn: async (request) => {
      const state: ChatMessage = {
        role: MessageRole.ASSISTANT,
        content: "",
        sources: [],
        related_queries: [],
        images: [],
        more_results: [],
      };
      addMessage({ role: MessageRole.USER, content: request.query });

      const req = {
        ...request,
        thread_id: threadId,
      };
      await streamChat({
        request: req,
        onMessage: (event) => {
          if (!event.data) return;
          const eventItem: ChatResponseEvent = JSON.parse(event.data);
          handleEvent(eventItem, state);
        },
      });
    },
  });

  const handleSend = async (query: string) => {
    await chat(convertToChatRequest(query, messages));
  };

  return {
    handleSend,
    streamingMessage,
    isStreamingMessage,
    isStreamingProSearch,
  };
};
