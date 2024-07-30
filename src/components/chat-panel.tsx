"use client";
import { useChat } from "@/hooks/chat";
import { useChatStore } from "@/stores";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AskInput } from "./ask-input";

import { SiteConfig } from "@/config/sites";
import { LoaderIcon, TrendingUpIcon } from "lucide-react";
import { MessageRole } from "@/schema/chat";

import MessagesList from "./messages-list";
import { StarterQuestionsList } from "./starter-questions";

const useAutoScroll = (ref: React.RefObject<HTMLDivElement>) => {
  const { messages } = useChatStore();

  useEffect(() => {
    if (messages.at(-1)?.role === MessageRole.USER) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, ref]);
};

const useAutoResizeInput = (
  ref: React.RefObject<HTMLDivElement>,
  setWidth: (width: number) => void
) => {
  const { messages } = useChatStore();

  useEffect(() => {
    const updatePosition = () => {
      if (ref.current) {
        setWidth(ref.current.scrollWidth);
      }
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [messages, ref, setWidth]);
};

const useAutoFocus = (ref: React.RefObject<HTMLTextAreaElement>) => {
  useEffect(() => {
    ref.current?.focus();
  }, [ref]);
};

export const ChatPanel = ({ threadId }: { threadId?: number }) => {
  const searchParams = useSearchParams();
  const queryMessage = searchParams.get("q");
  const hasRun = useRef(false);

  const { handleSend, streamingMessage, isStreamingMessage } = useChat();
  const { messages, setMessages, setThreadId } = useChatStore();

  const [width, setWidth] = useState(0);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const messageBottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useAutoScroll(messageBottomRef);
  useAutoResizeInput(messagesRef, setWidth);
  useAutoFocus(inputRef);

  useEffect(() => {
    if (queryMessage && !hasRun.current) {
      setThreadId(null);
      hasRun.current = true;
      handleSend(queryMessage);
    }
  }, [queryMessage]);

  useEffect(() => {
    if (messages.length == 0) {
      setThreadId(null);
    }
  }, [messages, setThreadId]);

  return (
    <>
      {messages.length > 0 ? (
        <div ref={messagesRef} className="pt-10 w-full relative">
          <MessagesList
            messages={messages}
            streamingMessage={streamingMessage}
            isStreamingMessage={isStreamingMessage}
            onRelatedQuestionSelect={handleSend}
          />
          <div ref={messageBottomRef} className="h-0" />
          <div
            className="bottom-12 fixed px-2 max-w-screen-md justify-center items-center md:px-2"
            style={{ width: `${width}px` }}
          >
            <AskInput isFollowingUp sendMessage={handleSend} />
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex flex-col items-center justify-center mb-8">
            <span className="text-3xl">{SiteConfig.subPanel}</span>
          </div>
          <AskInput sendMessage={handleSend} />
          <div className="w-full flex flex-row px-3 justify-between items-center space-y-2 pt-8">
            <div className="hidden text-tint lg:flex space-x-1 items-center">
              <span>People are searching</span>
              <TrendingUpIcon className="w-4 h-4" />
            </div>
            <StarterQuestionsList handleSend={handleSend} />
          </div>
        </div>
      )}
    </>
  );
};
