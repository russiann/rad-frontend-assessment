import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

type ErrorAlertProps = {
  error: string;
  onDismiss?: () => void;
  variant?: 'default' | 'inline';
  className?: string;
};

export function ErrorAlert({ 
  error, 
  onDismiss, 
  variant = 'default',
  className = '' 
}: ErrorAlertProps) {
  const baseClasses = "p-3 bg-danger-50 border border-danger-200 rounded-lg";
  const finalClasses = `${baseClasses} ${className}`;

  if (variant === 'inline') {
    return (
      <div className={finalClasses}>
        <div className="flex items-center gap-2">
          <Icon icon="lucide:alert-circle" className="text-danger-500 flex-shrink-0" />
          <span className="text-danger-700 text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={finalClasses}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:alert-circle" className="text-danger-500 flex-shrink-0" />
          <span className="text-danger-700 text-sm">{error}</span>
        </div>
        {onDismiss && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            onPress={onDismiss}
          >
            <Icon icon="lucide:x" />
          </Button>
        )}
      </div>
    </div>
  );
} 