import { MessageComponent, MessageComponentSkeleton } from "./message";
import { SearchResultsSkeleton, SearchResults } from "./search-results";
import { Section } from "./section";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImagePreload } from "./image-section";
import { ChatMessage } from "@/schema/chat";
import MoreResults from "./more-results";

export function ErrorMessage({ content }: { content: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{content}</AlertDescription>
    </Alert>
  );
}

export const AssistantMessageContent = ({
  message,
  isStreaming = false,
  onRelatedQuestionSelect,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
  onRelatedQuestionSelect: (question: string) => void;
}) => {
  const {
    sources,
    content,
    related_queries,
    images,
    is_error_message = false,
    more_results,
  } = message;

  if (is_error_message) {
    return <ErrorMessage content={message.content} />;
  }

  return (
    <div className="flex flex-col">
      <Section title="Sources" animate={isStreaming}>
        {!sources || sources.length === 0 ? (
          <SearchResultsSkeleton />
        ) : (
          <>
            <SearchResults results={sources} />
          </>
        )}
      </Section>
      <ImagePreload images={images || []} />
      <Section title="Answer" animate={isStreaming} streaming={isStreaming}>
        {content ? (
          <MessageComponent message={message} isStreaming={isStreaming} />
        ) : (
          <MessageComponentSkeleton />
        )}
      </Section>
      {more_results && more_results.length > 0 && (
        <Section title="More Results" animate={isStreaming}>
          <MoreResults results={more_results} />
        </Section>
      )}
    </div>
  );
};
