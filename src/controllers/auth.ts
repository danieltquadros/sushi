import { RequestHandler } from 'express';
import { signupSchema } from '../schemas/sigmup';
import { createUser, findUserByEmail } from '../services/user';
import { hash } from 'bcrypt-ts';
import { createJWT } from '../utils/jwt';

export const signup: RequestHandler = async (req, res) => {
  // validar os dados recebidos
  const safeData = signupSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  // verificar email
  const hasEmail = await findUserByEmail(safeData.data.email);
  if (hasEmail) {
    res.json({ error: 'E-mail já cadastrado.' });
    return;
  }
  // gerar hash de senha
  const hashPassword = await hash(safeData.data.password, 10);

  // cria usuário
  const newUser = await createUser({
    firstName: safeData.data.firstName,
    lastName: safeData.data.lastName,
    email: safeData.data.email,
    password: hashPassword,
  });

  // cria o token
  const token = createJWT(newUser.id);

  // retorna o resultado (token, user)

  res.status(201).json({
    token,
    user: {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      avatar: newUser.avatar,
      roles: newUser.roles,
    },
  });
};
