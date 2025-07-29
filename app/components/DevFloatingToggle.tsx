import React from "react";
import { Button, Card, CardBody, Switch, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDevToggle } from "../contexts/DevToggleContext";
import { trpc } from "../utils/trpc";
import { showSuccessToast } from "../utils/notifications";
import { useParams } from "react-router";

export default function DevFloatingToggle() {
  const { isRealTimeNotificationsEnabled, toggleRealTimeNotifications } = useDevToggle();
  const { productId } = useParams();
  const currentProductId = parseInt(productId || "0");

  const makeAllAvailableMutation = trpc.dev.makeAllProductsAvailable.useMutation({
    onSuccess: () => {
      showSuccessToast("All products have been marked as available!");
    },
    onError: (error: any) => {
      showSuccessToast(`Error: ${error.message}`, "danger");
    }
  });

  const triggerPriceChangeMutation = trpc.dev.triggerPriceChange.useMutation({
    onSuccess: () => {
      // No notification needed - the real-time notification will appear
    },
    onError: (error: any) => {
      // No notification needed
    }
  });

  const toggleAvailabilityMutation = trpc.dev.toggleProductAvailability.useMutation({
    onSuccess: (data) => {
      // No notification needed - the real-time notification will appear
    },
    onError: (error: any) => {
      // No notification needed
    }
  });

  const handleMakeAllAvailable = () => {
    makeAllAvailableMutation.mutate();
  };

  const handleTriggerPriceChange = () => {
    if (currentProductId) {
      triggerPriceChangeMutation.mutate({ productId: currentProductId });
    } else {
      // No notification needed
    }
  };

  const handleToggleAvailability = () => {
    if (currentProductId) {
      toggleAvailabilityMutation.mutate({ productId: currentProductId });
    } else {
      // No notification needed
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80 shadow-lg border border-gray-200">
        <CardBody className="p-4">
          {/* Header with toggle on the right */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:settings" className="text-primary" />
              <span className="font-medium">Dev Tools</span>
            </div>
            <Switch
              size="sm"
              isSelected={isRealTimeNotificationsEnabled}
              onValueChange={toggleRealTimeNotifications}
              color="primary"
            />
          </div>

          {isRealTimeNotificationsEnabled && (
            <>
              {/* Current Product Info */}
              {currentProductId ? (
                <div className="my-3 p-2 bg-primary-50 rounded-md">
                  <p className="text-xs text-primary-700">
                    🎯 Current product: #{currentProductId}
                  </p>
                </div>
              ) : (
                <div className="my-3 p-2 bg-warning-50 rounded-md">
                  <p className="text-xs text-warning-700">
                    ⚠️ Go to a product page to test
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  size="sm"
                  color="warning"
                  variant="flat"
                  fullWidth
                  startContent={<Icon icon="lucide:dollar-sign" />}
                  onPress={handleTriggerPriceChange}
                  isDisabled={!currentProductId}
                  isLoading={triggerPriceChangeMutation.isPending}
                >
                  Simulate Price Change
                </Button>

                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  fullWidth
                  startContent={<Icon icon="lucide:package-x" />}
                  onPress={handleToggleAvailability}
                  isDisabled={!currentProductId}
                  isLoading={toggleAvailabilityMutation.isPending}
                >
                  Toggle Availability
                </Button>
                
                <Button
                  size="sm"
                  color="success"
                  variant="flat"
                  fullWidth
                  startContent={<Icon icon="lucide:check-circle" />}
                  onPress={handleMakeAllAvailable}
                  isLoading={makeAllAvailableMutation.isPending}
                >
                  Make All Products Available
                </Button>
              </div>

            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
} 