import React from "react";
import AiAssistant from "../AiAssistant";
import { ChatHeader } from "../partials/ChatHeader";

type ChatSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  chatKey: string;
};

export function ChatSidebar({ isOpen, onClose, chatKey }: ChatSidebarProps) {
  return (
    <aside className={`border-l border-divider bg-content1 transition-all duration-300 ease-in-out flex-shrink-0
      ${isOpen ? 'w-80 md:w-96' : 'w-0 overflow-hidden'}
    `} style={{ height: 'calc(100vh - 64px - 60px)' }}>
      {isOpen && (
        <div className="h-full flex flex-col">
          <ChatHeader onClose={onClose} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AiAssistant key={chatKey} />
          </div>
        </div>
      )}
    </aside>
  );
} 