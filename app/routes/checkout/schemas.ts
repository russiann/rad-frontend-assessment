import { z } from 'zod';

export const checkoutFormSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email'),
  address: z.string()
    .min(1, 'Delivery address is required')
    .min(10, 'Please provide a complete address'),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>; 