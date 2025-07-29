import React from "react";
import { Card, CardBody, Input, Button, Textarea, Spinner } from "@heroui/react";
import { Controller } from "react-hook-form";
import { Icon } from "@iconify/react";
import { ErrorAlert } from "../../../components/common/ErrorAlert";
import type { CheckoutFormData } from "../schemas";
import type { Control, FieldErrors } from "react-hook-form";

type CheckoutFormProps = {
  control: Control<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  onSubmit: () => void;
  isLoading: boolean;
  apiError: string | null;
  isValid: boolean;
  onClearError: () => void;
};

export function CheckoutForm({ 
  control, 
  errors, 
  onSubmit, 
  isLoading, 
  apiError, 
  isValid,
  onClearError 
}: CheckoutFormProps) {
  return (
    <div className="flex-1">
      <Card>
        <CardBody>
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          
          {/* API Error Display */}
          {apiError && (
            <ErrorAlert 
              error={apiError}
              onDismiss={onClearError}
              className="mb-4"
            />
          )}

          <form className="space-y-6" onSubmit={onSubmit}>
            {/* Name Field */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Full Name"
                  placeholder="Enter your full name"
                  isRequired
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  isDisabled={isLoading}
                />
              )}
            />
            
            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Email Address"
                  placeholder="Enter your email"
                  type="email"
                  isRequired
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                  isDisabled={isLoading}
                />
              )}
            />
            
            {/* Address Field */}
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Delivery Address"
                  placeholder="Enter your complete address"
                  minRows={3}
                  isRequired
                  isInvalid={!!errors.address}
                  errorMessage={errors.address?.message}
                  isDisabled={isLoading}
                />
              )}
            />
            
            {/* Submit Button */}
            <Button 
              color="primary" 
              type="submit"
              size="lg"
              className="w-full mt-4"
              isDisabled={isLoading}
              isLoading={isLoading}
              startContent={!isLoading && <Icon icon="lucide:check" />}
            >
              {isLoading ? "Processing Order..." : "Complete Order"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
} 