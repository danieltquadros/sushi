import { RequestHandler } from 'express';
import { signupSchema } from '../schemas/sigmup';
import { createUser, findUserByEmail } from '../services/user';
import { compare, hash } from 'bcrypt-ts';
import { createJWT } from '../utils/jwt';
import { signInSchema } from '../schemas/signIn';

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
    roles: safeData.data.roles,
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

export const signIn: RequestHandler = async (req, res) => {
  // validar os dados recebidos
  const safeData = signInSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  const user = await findUserByEmail(safeData.data.email);
  if (!user) {
    res.status(401).json({ error: 'E-mail e/ou senha inválidos.' });
    return;
  }

  const verifyPass = await compare(safeData.data.password, user.password);
  if (!verifyPass) {
    res.status(401).json({ error: 'E-mail e/ou senha inválidos.' });
    return;
  }

  const token = createJWT(user.id);

  res.json({
    token,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      roles: user.roles,
    },
  });
};
