import React from "react";
import { useAiAssistant } from "./useAiAssistant";
import { ChatArea } from "./partials/ChatArea";
import { MessageInput } from "./partials/MessageInput";
import { ChatSuggestions } from "./partials/ChatSuggestions";

export default function AiAssistant() {
  const { state, actions, form } = useAiAssistant();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <ChatArea 
          messages={state.messages} 
          isLoading={state.isLoading}
        />
      </div>
      
      <div className="flex-shrink-0 border-t">
        <ChatSuggestions 
          onSuggestionClick={actions.handleSuggestionClick}
          isLoading={state.isLoading}
        />
        
        <MessageInput 
          control={form.control}
          errors={form.errors}
          onSubmit={actions.sendMessage}
          isLoading={state.isLoading}
          isValid={state.isValid}
          handleSubmit={form.handleSubmit}
        />
      </div>
    </div>
  );
} 