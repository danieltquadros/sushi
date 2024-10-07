import { z } from 'zod';

export const signupSchema = z.object({
  firstName: z
    .string({ message: 'Primeiro nome é obrigatório.' })
    .min(2, 'Precisa ter no mínimo 2 caracteres.'),
  lastName: z
    .string({ message: 'Sobrenome é obrigatório.' })
    .min(2, 'Precisa ter no mínimo 2 caracteres.'),
  email: z
    .string({ message: 'Email é obrigatório.' })
    .email('E-mail inválido.'),
  password: z
    .string({ message: 'Senha é obrigatório.' })
    .min(4, 'Precisa ter no mínimo 4 caracteres.'),
});
