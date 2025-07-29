import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../server/trpc/router';
import type { inferRouterOutputs } from '@trpc/server';

export const trpc = createTRPCReact<AppRouter>();

// Type helpers para inferir types do router
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type Product = RouterOutputs['product']['list'][number]; 