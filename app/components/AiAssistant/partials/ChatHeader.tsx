import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

type ChatHeaderProps = {
  onClose: () => void;
  className?: string;
};

export function ChatHeader({ onClose, className = "" }: ChatHeaderProps) {
  return (
    <div className={`p-4 border-b flex justify-between items-center bg-content2 flex-shrink-0 ${className}`}>
      <div className="flex items-center gap-2">
        <Icon icon="lucide:message-square" className="text-primary text-lg" />
        <span className="font-semibold text-lg">Shopping Assistant</span>
      </div>
      <Button 
        isIconOnly 
        size="md" 
        variant="light" 
        radius="full"
        className="hover:bg-danger-50 hover:text-danger"
        onPress={onClose}
        aria-label="Close assistant"
      >
        <Icon icon="lucide:x" className="text-lg" />
      </Button>
    </div>
  );
} 