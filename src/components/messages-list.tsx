import { AssistantMessageContent } from "./assistant-message";
import { Separator } from "./ui/separator";
import { UserMessageContent } from "./user-message";
import { memo } from "react";
import { ChatMessage, MessageRole } from "@/schema/chat";

const MessagesList = ({
  messages,
  streamingMessage,
  isStreamingMessage,
  onRelatedQuestionSelect,
}: {
  messages: ChatMessage[];
  streamingMessage: ChatMessage | null;
  isStreamingMessage: boolean;
  onRelatedQuestionSelect: (question: string) => void;
}) => {
  return (
    <div className="flex flex-col pb-28">
      {messages.map((message, index) =>
        message.role === MessageRole.USER ? (
          <UserMessageContent key={index} message={message} />
        ) : (
          <div key={index}>
            <AssistantMessageContent
              key={index}
              message={message}
              onRelatedQuestionSelect={onRelatedQuestionSelect}
            />
            {index !== messages.length - 1 && <Separator />}
          </div>
        )
      )}
      {streamingMessage && isStreamingMessage && (
        <AssistantMessageContent
          message={streamingMessage}
          isStreaming={true}
          onRelatedQuestionSelect={onRelatedQuestionSelect}
        />
      )}
    </div>
  );
};

export default memo(MessagesList);
