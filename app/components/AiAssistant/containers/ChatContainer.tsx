import React, { useEffect, useState } from "react";
import { useChatContext } from "../../../contexts/ChatContext";
import { ChatSidebar } from "./ChatSidebar";
import { ChatDrawer } from "./ChatDrawer";

export function ChatContainer() {
  const { isOpen, onOpenChange } = useChatContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleClose = () => {
    onOpenChange();
  };

  // Use the same key for AiAssistant to prevent unmounting
  const chatKey = "ai-assistant-persistent";

  if (isMobile) {
    return <ChatDrawer isOpen={isOpen} onClose={handleClose} chatKey={chatKey} />;
  }

  return <ChatSidebar isOpen={isOpen} onClose={handleClose} chatKey={chatKey} />;
} 