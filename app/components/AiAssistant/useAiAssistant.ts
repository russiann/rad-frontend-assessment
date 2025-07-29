import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageInputSchema, type MessageInputData } from "./schemas";
import { trpc } from "../../utils/trpc";
import { useParams } from "react-router";
import { useChatContext, type Message } from "../../contexts/ChatContext";

export type SuggestionType = 'best-deals' | 'trending' | 'gift-help' | 'product-info' | 'good-deal' | 'complementary';

export type Suggestion = {
  id: string;
  text: string;
  type: SuggestionType;
  icon: string;
};

export function useAiAssistant() {
  // Use global chat state from context
  const { 
    messages, 
    setMessages, 
    isLoading, 
    setIsLoading, 
    isAiThinking, 
    setIsAiThinking 
  } = useChatContext();
  
  const params = useParams();
  const productId = params.id;
  const currentAIMessageRef = useRef<{ id: number; text: string; messageId: string } | null>(null);
  const sessionId = 'default'; // Para simplificar, usando um sessionId fixo

  // Form management
  const form = useForm<MessageInputData>({
    resolver: zodResolver(messageInputSchema),
    defaultValues: {
      message: "",
    },
  });

  const messageIdCounter = useRef(1);

  // tRPC mutations
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      setIsAiThinking(true);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      setIsLoading(false);
      setIsAiThinking(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Sorry, I'm having trouble connecting. Please try again.",
        isUser: false,
      }]);
    },
  });

  // AI response subscription - using the correct API
  trpc.chat.onAIResponse.useSubscription(
    { sessionId: 'default' },
    {
      onData: (data) => {
        const { chunk, isComplete, messageId } = data;
        
        // Always stop thinking and loading states when any chunk arrives
        setIsAiThinking(false);
        setIsLoading(false);
        
        // Don't process empty chunks
        if (!chunk || !chunk.trim()) {
          return;
        }
        
        setMessages(prev => {
          const newMessages = [...prev];
          
          // Check if a message with this messageId already exists
          const existingMessageIndex = newMessages.findIndex(
            m => !m.isUser && m.messageId === messageId
          );
          
          if (existingMessageIndex !== -1) {
            // Update existing message
            newMessages[existingMessageIndex] = {
              ...newMessages[existingMessageIndex],
              text: chunk,
            };
          } else {
            // Create new message
            const newMessage = {
              id: parseInt(messageId.replace('ai-', '')) || Date.now(),
              text: chunk,
              isUser: false,
              messageId,
            };
            
            newMessages.push(newMessage);
          }
          
          return newMessages;
        });
      },
      onError: (error) => {
        console.error("Error with AI response subscription:", error);
        setIsLoading(false);
        setIsAiThinking(false); // Also reset thinking state on error
      },
    }
  );

  // Combined loading state
  const combinedIsLoading = isLoading || sendMessageMutation.isPending || isAiThinking;

  const sendMessage = async (data: MessageInputData) => {
    if (!data.message.trim()) return;

    const userMessage: Message = {
      id: messageIdCounter.current++,
      text: data.message,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsAiThinking(false); // Reset thinking state before sending new message
    form.reset();

    try {
      await sendMessageMutation.mutateAsync({
        message: data.message,
        sessionId: 'default',
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
      setIsAiThinking(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (combinedIsLoading) return;
    
    form.setValue('message', suggestion.text);
    sendMessage({ message: suggestion.text });
  };

  return {
    state: {
      messages: messages.filter(message => message.text && message.text.trim()),
      isLoading: combinedIsLoading,
      isValid: form.formState.isValid,
    },
    actions: {
      sendMessage,
      handleSuggestionClick,
    },
    form: {
      control: form.control,
      errors: form.formState.errors,
      handleSubmit: form.handleSubmit,
    },
  };
} 