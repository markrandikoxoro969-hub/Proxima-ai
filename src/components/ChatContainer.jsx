import { useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import EmptyState from './EmptyState';

export default function ChatContainer({ sessions, currentSessionId, user, streamingMsgId, streamingText }) {
  const containerRef = useRef(null);
  const session = sessions[currentSessionId];
  const history = session?.history || [];
  const hasMessages = history.length > 0;

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history.length, streamingMsgId, streamingText, scrollToBottom]);

  return (
    <div id="chat-container" ref={containerRef} className="flex-1 overflow-y-auto px-4 lg:px-8 pt-24 pb-32 flex flex-col gap-6 scroll-smooth">
      {!hasMessages && streamingMsgId == null ? (
        <EmptyState user={user} />
      ) : (
        <AnimatePresence mode="wait">
          {history.map((msg, index) => (
            <MessageBubble
              key={`${msg.timestamp}-${index}`}
              role={msg.role}
              content={msg.content}
              time={msg.timestamp}
              id={`msg-${msg.timestamp}-${index}`}
              streaming={false}
              streamingText=""
              userName={user.name || 'USER'}
            />
          ))}
          {streamingMsgId && (
            <MessageBubble
              key="streaming"
              role="ai"
              content=""
              time={new Date().toISOString()}
              id={streamingMsgId}
              streaming={true}
              streamingText={streamingText}
              userName={user.name || 'USER'}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
