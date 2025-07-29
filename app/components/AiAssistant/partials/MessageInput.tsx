import React from "react";
import { Input, Button, Spinner } from "@heroui/react";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { Icon } from "@iconify/react";
import type { MessageInputData } from "../schemas";

type MessageInputProps = {
  control: Control<MessageInputData>;
  errors: FieldErrors<MessageInputData>;
  onSubmit: (data: MessageInputData) => void;
  isLoading: boolean;
  isValid: boolean;
  handleSubmit: UseFormHandleSubmit<MessageInputData>;
};

export function MessageInput({ 
  control, 
  errors, 
  onSubmit, 
  isLoading, 
  isValid,
  handleSubmit 
}: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="border-t bg-content1 p-4">
      <form className="flex gap-3 items-end" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-1">
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Type your question..."
                size="lg"
                variant="bordered"
                radius="lg"
                classNames={{
                  input: "text-sm",
                  inputWrapper: "bg-content2 border-1 hover:border-primary-300 group-data-[focus=true]:border-primary min-h-[48px] pr-0",
                }}
                isInvalid={!!errors.message}
                errorMessage={errors.message?.message}
                isDisabled={isLoading}
                onKeyDown={handleKeyDown}
                endContent={
                  <Button
                    isIconOnly
                    color="primary"
                    size="md"
                    type="submit"
                    variant="solid"
                    radius="lg"
                    className="min-w-12 h-12"
                    isDisabled={!isValid || isLoading}
                    isLoading={isLoading}
                  >
                    {isLoading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      <Icon icon="lucide:send" className="text-base" />
                    )}
                  </Button>
                }
              />
            )}
          />
        </div>
      </form>
    </div>
  );
} 