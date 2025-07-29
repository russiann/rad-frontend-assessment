import React, { createContext, useContext, useState } from "react";
import { useDisclosure } from "@heroui/react";

export type Message = {
  id: number;
  text: string;
  isUser: boolean;
  messageId?: string;
};

type ChatContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  // Message state
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAiThinking: boolean;
  setIsAiThinking: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  // Message state - persisted across container changes
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you with your shopping today?",
      isUser: false,
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  return (
    <ChatContext.Provider value={{ 
      isOpen, 
      onOpen, 
      onOpenChange,
      messages,
      setMessages,
      isLoading,
      setIsLoading,
      isAiThinking,
      setIsAiThinking
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
} 