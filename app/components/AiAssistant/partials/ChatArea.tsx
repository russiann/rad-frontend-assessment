import React, { useRef, useEffect } from "react";
import { Card, Avatar, Spinner } from "@heroui/react";
import type { Message } from "../../../contexts/ChatContext";
import { Icon } from "@iconify/react";

type ChatAreaProps = {
  messages: Message[];
  isLoading?: boolean;
};

export function ChatArea({ messages, isLoading = false }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      // Directly scroll the chat container to bottom
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={chatContainerRef}
      className="h-full overflow-y-auto p-4 space-y-4"
      style={{ 
        scrollBehavior: 'smooth',
        maxHeight: '100%'
      }}
    >
      {messages
        .filter(message => message.text && message.text.trim()) // Filter out empty messages
        .map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
        >
          <div 
            className={`flex gap-2 max-w-[80%] ${
              message.isUser ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {!message.isUser && (
              <Avatar
                name="AI"
                size="sm"
                color="primary"
                className="flex-shrink-0 min-w-8"
              />
            )}
            <div 
              className={`rounded-lg p-3 ${
                message.isUser 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-content2 rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{message.text}</div>
            </div>
            {message.isUser && (
              <Avatar
                name="You" 
                size="sm"
                color="default"
                className="flex-shrink-0 min-w-8"
              />
            )}
          </div>
        </div>
      ))}
      
      {/* Typing indicator */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex gap-2 max-w-[80%]">
            <Avatar
              name="AI"
              size="sm"
              color="primary"
              className="flex-shrink-0 min-w-8"
            />
            <div className="rounded-lg p-3 bg-content2 rounded-tl-none">
              <div className="flex items-center gap-2">
                <Spinner size="sm" color="primary" />
                <span className="text-sm text-default-500">Thinking...</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Auto scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
} 