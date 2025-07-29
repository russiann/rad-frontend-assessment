import { z } from 'zod';
import { procedure, router } from './trpc';
import { db } from '../db';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';
import { checkoutFormSchema } from '../../app/routes/checkout/schemas';
import { EventEmitter, on } from 'events';
import { tracked } from '@trpc/server';

// Order item schema for tRPC
const orderItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
});

// Chat schemas
const chatMessageSchema = z.object({
  id: z.string(),
  message: z.string(),
  isUser: z.boolean(),
  timestamp: z.date(),
});

const sendMessageSchema = z.object({
  message: z.string().min(1).max(500).trim(),
  sessionId: z.string().optional().default('default'),
});

// Event emitter for chat messages
const chatEventEmitter = new EventEmitter();

// Event emitter for product updates
const productEventEmitter = new EventEmitter();

// Function to actually update the database and emit changes
async function emitProductChange(productId: number, productName: string, changeType?: 'price_change' | 'availability_change', forceAvailability?: boolean) {
  setTimeout(async () => {
    try {
      // Use provided changeType or randomly choose between price change or availability change
      const actualChangeType = changeType || (Math.random() < 0.6 ? 'price_change' : 'availability_change');
      
      if (actualChangeType === 'price_change') {
        // Generate new random price (between 50% to 150% of a base price around 100)
        const newPrice = Math.round((50 + Math.random() * 100) * 100) / 100; // Between $50-$150
        
        // Actually update the database
        await db.update(products)
          .set({ 
            price: newPrice,
            updatedAt: new Date()
          })
          .where(eq(products.id, productId));
        
        // Emit the change
        productEventEmitter.emit('productUpdate', {
          productId,
          type: 'price_change',
          data: {
            productName,
            newPrice,
            timestamp: new Date(),
          },
        });
      } else {
        // For availability changes, use forceAvailability if provided, otherwise use current logic
        let newAvailability: boolean;
        
        if (forceAvailability !== undefined) {
          newAvailability = forceAvailability;
        } else {
          // Original logic: toggle availability
          const currentProduct = await db.select().from(products).where(eq(products.id, productId));
          newAvailability = currentProduct[0] ? !currentProduct[0].isAvailable : false;
        }
        
        // Actually update the database
        await db.update(products)
          .set({ 
            isAvailable: newAvailability,
            updatedAt: new Date()
          })
          .where(eq(products.id, productId));
        
        // Emit the change
        productEventEmitter.emit('productUpdate', {
          productId,
          type: 'availability_change',
          data: {
            productName,
            isAvailable: newAvailability,
            timestamp: new Date(),
          },
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }, 2000); // 2 second delay
}

// Track recent product views to avoid spam
const recentViews = new Set<number>();

export const appRouter = router({
  product: router({
    list: procedure.query(async () => {
      return await db.select().from(products);
    }),

    getById: procedure
      .input(z.object({ 
        id: z.number()
      }))
      .query(async ({ input }) => {
        const result = await db.select().from(products).where(eq(products.id, input.id));
        return result[0] || null;
      }),

    create: procedure
      .input(z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        image: z.string(),
        category: z.string(),
        stock: z.number().optional().default(0),
      }))
      .mutation(async ({ input }) => {
        const result = await db.insert(products).values(input).returning();
        return result[0];
      }),

    // Subscribe to product updates using correct tRPC v11 syntax
    onUpdate: procedure
      .input(z.object({
        productId: z.number().optional(),
      }))
      .subscription(async function* ({ input, signal }) {
        // Listen for product updates using async iterator with Node.js 'on'
        for await (const [data] of on(productEventEmitter, 'productUpdate', {
          signal, // Pass the AbortSignal to automatically clean up when client disconnects
        })) {
          const updateData = data as {
            productId: number;
            type: 'price_change' | 'availability_change';
            data: Record<string, any>;
          };

          // If no specific product ID, send all updates
          // If specific product ID, only send updates for that product
          if (!input.productId || updateData.productId === input.productId) {
            // Use tracked() to enable automatic reconnection with last event ID
            yield tracked(updateData.productId.toString(), {
              productId: updateData.productId,
              type: updateData.type,
              data: updateData.data,
            });
          }
        }
      }),
  }),

  // DEV TESTING API - Only for development toggle
  dev: router({
    triggerPriceChange: procedure
      .input(z.object({
        productId: z.number()
      }))
      .mutation(async ({ input }) => {
        // Get current product info
        const result = await db.select().from(products).where(eq(products.id, input.productId));
        const product = result[0];
        
        if (!product) {
          throw new Error('Product not found');
        }

        // Trigger price change directly
        emitProductChange(input.productId, product.name, 'price_change');
        
        return { success: true, message: 'Price change triggered', type: 'price_change' };
      }),

    toggleProductAvailability: procedure
      .input(z.object({
        productId: z.number()
      }))
      .mutation(async ({ input }) => {
        try {
          // Get current product info
          const result = await db.select().from(products).where(eq(products.id, input.productId));
          const product = result[0];
          
          if (!product) {
            throw new Error('Product not found');
          }

          // Toggle the availability immediately (no delay)
          const newAvailability = !product.isAvailable;
          
          // Update database immediately
          await db.update(products)
            .set({ 
              isAvailable: newAvailability,
              updatedAt: new Date()
            })
            .where(eq(products.id, input.productId));

          // Emit real-time event immediately
          productEventEmitter.emit('productUpdate', {
            productId: input.productId,
            type: 'availability_change',
            data: {
              productName: product.name,
              isAvailable: newAvailability,
              timestamp: new Date(),
            },
          });

          return { 
            success: true, 
            message: `Product is now ${newAvailability ? 'available' : 'unavailable'}`,
            isAvailable: newAvailability
          };
        } catch (error) {
          console.error('Error toggling product availability:', error);
          throw new Error('Failed to toggle product availability');
        }
      }),

    triggerProductChange: procedure
      .input(z.object({
        productId: z.number(),
        priceChangeEnabled: z.boolean().optional().default(true),
        availabilityChangeEnabled: z.boolean().optional().default(true),
      }))
      .mutation(async ({ input }) => {
        // Get current product info
        const result = await db.select().from(products).where(eq(products.id, input.productId));
        const product = result[0];
        
        if (!product) {
          throw new Error('Product not found');
        }

        // Check if this product was recently triggered to avoid spam (only for automatic triggers)
        const recentKey = `${input.productId}-${input.priceChangeEnabled ? 'price' : ''}-${input.availabilityChangeEnabled ? 'availability' : ''}`;
        if (recentViews.has(input.productId)) {
          return { success: false, message: 'Product change already triggered recently' };
        }

        // Determine what type of change to make based on enabled toggles
        let changeType: 'price_change' | 'availability_change' | undefined;
        
        if (input.priceChangeEnabled && input.availabilityChangeEnabled) {
          // Both enabled, choose randomly (60% price, 40% availability)
          changeType = Math.random() < 0.6 ? 'price_change' : 'availability_change';
        } else if (input.priceChangeEnabled) {
          changeType = 'price_change';
        } else if (input.availabilityChangeEnabled) {
          changeType = 'availability_change';
        } else {
          return { success: false, message: 'No change types enabled' };
        }

        // Add to recent views
        recentViews.add(input.productId);
        
        // For availability changes, ALWAYS make product unavailable when simulation is enabled
        if (changeType === 'availability_change') {
          // Always make unavailable when availability simulation is triggered
          emitProductChange(input.productId, product.name, 'availability_change', false);
        } else {
          // For price changes, use random logic
          emitProductChange(input.productId, product.name, changeType);
        }
        
        // Remove from recent views after 10 seconds
        setTimeout(() => {
          recentViews.delete(input.productId);
        }, 10000);

        return { success: true, message: 'Product change triggered', changeType };
      }),

    makeAllProductsAvailable: procedure
      .mutation(async () => {
        try {
          // Update all products to be available
          await db.update(products)
            .set({ 
              isAvailable: true,
              updatedAt: new Date()
            });

          return { success: true, message: 'All products are now available' };
        } catch (error) {
          console.error('Error making all products available:', error);
          throw new Error('Failed to update products');
        }
      }),

    makeProductAvailable: procedure
      .input(z.object({
        productId: z.number()
      }))
      .mutation(async ({ input }) => {
        try {
          // Update specific product to be available
          await db.update(products)
            .set({ 
              isAvailable: true,
              updatedAt: new Date()
            })
            .where(eq(products.id, input.productId));

          // Get product info for event
          const result = await db.select().from(products).where(eq(products.id, input.productId));
          const product = result[0];

          if (product) {
            // Emit event to notify clients
            productEventEmitter.emit('productUpdate', {
              productId: input.productId,
              type: 'availability_change',
              data: {
                productName: product.name,
                isAvailable: true,
                timestamp: new Date(),
              },
            });
          }

          return { success: true, message: 'Product is now available' };
        } catch (error) {
          console.error('Error making product available:', error);
          throw new Error('Failed to update product');
        }
      }),
  }),

  checkout: router({
    submitOrder: procedure
      .input(z.object({
        customer: checkoutFormSchema,
        items: z.array(orderItemSchema),
        subtotal: z.number(),
        shipping: z.number(),
        tax: z.number(),
        total: z.number(),
      }))
      .mutation(async ({ input }) => {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate random failures (20% chance)
        if (Math.random() > 0.8) {
          throw new Error("Falha na conexão com o servidor. Tente novamente.");
        }
        
        // Generate mock order ID
        const orderId = Math.floor(Math.random() * 1000000);
        
        return {
          success: true,
          orderId,
          message: "Pedido processado com sucesso!",
          customer: input.customer,
          items: input.items,
          total: input.total,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        };
      }),

    calculateSummary: procedure
      .input(z.object({
        items: z.array(orderItemSchema)
      }))
      .query(async ({ input }) => {
        const subtotal = input.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = 10.00;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;
        
        return {
          subtotal,
          shipping,
          tax,
          total,
        };
      }),
  }),

  chat: router({
    sendMessage: procedure
      .input(sendMessageSchema)
      .mutation(async ({ input }) => {
        const { message, sessionId } = input;
        
        // Mock streaming de resposta
        setTimeout(() => {
          const messageId = `ai-${Date.now()}`;
          
          // Check for contextual suggestion responses
          const getSuggestionResponse = (message: string) => {
            const lowerMessage = message.toLowerCase();
            
            if (message === "Show me the best deals") {
              return "I found some great deals for you! The Nike Air Max is currently 25% off at $89.99 (was $119.99), and the Apple iPhone has a special discount bringing it to $699 (was $799). These are some of the best value products right now based on price-to-quality ratio.";
            }
            
            if (message === "What's trending now?") {
              return "Currently trending: Wireless headphones are very popular this month, especially noise-canceling models. Gaming accessories are also seeing high demand. The Samsung Galaxy and fitness trackers are among our top-selling items this week!";
            }
            
            if (message === "Help me find a gift") {
              return "I'd love to help you find the perfect gift! For tech lovers, I recommend the Apple AirPods or Samsung Galaxy. For fashion enthusiasts, check out our Nike Air Max collection. What's your budget range and who is the gift for?";
            }
            
            if (message === "Tell me more about this product") {
              return "This product features excellent quality and performance. Based on customer reviews (4.5/5 stars), users particularly love its reliability and value. It's designed for both everyday use and demanding tasks, making it a versatile choice.";
            }
            
            if (message === "Is this a good deal?") {
              return "Yes, this is a solid deal! At this price, this product is below the average market price. Based on its features and customer reviews, it offers excellent value for money. It's a good time to buy!";
            }
            
            if (message === "What goes well with this?") {
              return "Great accessories that go well with this product include: protective cases, wireless chargers, and premium headphones. Many customers also buy screen protectors and portable stands. These combinations enhance your experience!";
            }
            
            // Default response for other messages
            return `Thanks for your message: "${message}". I'm here to help you with your shopping needs. You can ask me about products, deals, or anything else related to our store!`;
          };
          
          const responseText = getSuggestionResponse(input.message);
          
          // Simular streaming palavra por palavra
          const words = responseText.split(' ').filter(word => word.trim()); // Remove empty words
          let currentText = '';
          
          words.forEach((word, index) => {
            setTimeout(() => {
              currentText += (index > 0 ? ' ' : '') + word;
              
              // Only emit if we have content
              if (currentText.trim()) {
                chatEventEmitter.emit('aiResponse', {
                  sessionId: input.sessionId,
                  chunk: currentText,
                  isComplete: index === words.length - 1,
                  messageId,
                });
              }
            }, (index + 1) * 100); // Start from 100ms for first word, ensures no immediate emission
          });
        }, 2500); // Increased delay to give time for "Thinking..." state
        
        return {
          success: true,
          messageId: `user-${Date.now()}`,
          timestamp: new Date(),
        };
      }),

    onAIResponse: procedure
      .input(z.object({
        sessionId: z.string().optional().default('default'),
      }))
      .subscription(async function* ({ input, signal }) {
        // Listen for AI messages using Node.js 'on' with async iteration
        for await (const [data] of on(chatEventEmitter, 'aiResponse', {
          signal, // Automatically clean up when client disconnects
        })) {
          const aiData = data as {
            sessionId: string;
            chunk: string;
            isComplete: boolean;
            messageId: string;
          };

          if (aiData.sessionId === input.sessionId) {
            yield {
              chunk: aiData.chunk,
              isComplete: aiData.isComplete,
              messageId: aiData.messageId,
            };
          }
        }
      }),
  }),

});

export type AppRouter = typeof appRouter;
export type ChatMessage = z.infer<typeof chatMessageSchema>; 