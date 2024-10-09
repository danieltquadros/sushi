import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string({ message: 'Email é obrigatório.' })
    .email('E-mail inválido.'),
  password: z
    .string({ message: 'Senha é obrigatório.' })
    .min(4, 'Precisa ter no mínimo 4 caracteres.'),
});
