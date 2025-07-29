import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router";

export function EmptyCart() {
  return (
    <div className="py-16 text-center">
      <p className="text-default-600 mb-6">Your cart is currently empty.</p>
      <Button 
        as={Link} 
        to="/" 
        color="primary"
        startContent={<Icon icon="lucide:arrow-left" />}
      >
        Continue Shopping
      </Button>
    </div>
  );
} 