import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema, type CheckoutFormData } from "./schemas";
import { trpc } from "../../utils/trpc";
import { useCartContext, type CartItem } from "../../contexts/CartContext";

export type FormData = CheckoutFormData;

export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export function useCheckout() {
  const navigate = useNavigate();
  const { state: cartState, actions: cartActions } = useCartContext();
  
  // tRPC mutation for submitting order
  const submitOrderMutation = trpc.checkout.submitOrder.useMutation({
    onSuccess: (data) => {
      console.log("Order placed:", data);
      cartActions.clearCart(); // Reset cart after successful order
      navigate("/order-confirmation");
    },
  });
  
  // React Hook Form setup with Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
    getValues, // Alternative to watch for one-time reads
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: ""
    },
    mode: "all", // Enable validation on change, blur, and submit
  });
  
  // Calculate order summary using cart data
  const orderItems: OrderItem[] = cartState.items.map((item: CartItem) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));
  
  const subtotal = cartState.subtotal;
  const shipping = cartState.items.length > 0 ? 10.00 : 0;
  const tax = cartState.tax;
  const total = subtotal + shipping + tax;
  
  const handleOrderSubmit = async (data: CheckoutFormData) => {
    submitOrderMutation.reset();
    
    try {
      console.log("Submitting order:", { customer: data });
      
      // Call tRPC API
      await submitOrderMutation.mutateAsync({
        customer: data,
        items: orderItems,
        subtotal,
        shipping,
        tax,
        total,
      });
      
    } catch (error) {
      // Error handling is automatic with tRPC useMutation
      console.error("Order submission error:", error);
    }
  };

  const submitOrder = handleSubmit(handleOrderSubmit);

  return {
    state: {
      orderItems,
      subtotal,
      shipping,
      tax,
      total,
      isLoading: submitOrderMutation.isPending,
      apiError: submitOrderMutation.error?.message || null,
      isValid,
      isDirty,
    },
    actions: {
      submitOrder,
      clearError: submitOrderMutation.reset,
      resetForm: reset,
    },
    form: {
      control,
      errors,
      handleSubmit,
      reset,
      watch,
      getValues,
    },
  };
} 