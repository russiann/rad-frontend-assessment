import type { LoaderFunction, ActionFunction } from "react-router";
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../server/trpc/router';

export const loader: LoaderFunction = async ({ request }) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () => ({}),
  });
};

export const action: ActionFunction = async ({ request }) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () => ({}),
  });
}; 