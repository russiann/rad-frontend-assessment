import { z } from 'zod';

export const messageInputSchema = z.object({
  message: z
    .string()
    .min(1, 'Mensagem não pode estar vazia')
    .max(500, 'Mensagem deve ter no máximo 500 caracteres')
    .trim()
});

export type MessageInputData = z.infer<typeof messageInputSchema>; 