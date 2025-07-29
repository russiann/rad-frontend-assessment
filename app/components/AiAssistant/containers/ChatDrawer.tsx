import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import AiAssistant from "../AiAssistant";

type ChatDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  chatKey: string;
};

export function ChatDrawer({ isOpen, onClose, chatKey }: ChatDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      size="lg"
      classNames={{
        base: "data-[placement=right]:sm:m-2 data-[placement=right]:sm:mx-2 data-[placement=right]:sm:rounded-medium",
        body: "p-0",
        closeButton: "text-xl hover:bg-danger-50 hover:text-danger",
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex gap-2 items-center">
          <Icon icon="lucide:message-square" className="text-primary text-lg" />
          <span>Shopping Assistant</span>
        </DrawerHeader>
        <DrawerBody className="flex flex-col overflow-hidden">
          <AiAssistant key={chatKey} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
} 