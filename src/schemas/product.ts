import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string({ message: 'Nome do produto é obrigatório.' })
    .min(2, 'Precisa ter no mínimo 2 caracteres.'),
});
