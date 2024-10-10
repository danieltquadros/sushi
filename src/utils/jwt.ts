import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../services/user';
import { ExtendedRequest } from '../types/extended-request';

// Função para gerar o token JWT
export const createJWT = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string);
};

// Middleware para verificar JWT e roles
export const verifyJWT = (roles: string[] = []) => {
  return async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        res.status(401).json({ error: 'Acesso negado.' });
        return;
      }

      const token = authHeader.split(' ')[1];

      jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        async (error, decoded: any) => {
          if (error) {
            return res.status(401).json({ error: 'Acesso negado.' });
          }

          const user = await findUserById(decoded.id);
          if (!user) {
            return res.status(401).json({ error: 'Acesso negado.' });
          }

          const userRoles = user.roles; // Certifique-se de que role aqui seja uma string ou array de strings
          if (roles.length && !roles.some((role) => userRoles.includes(role))) {
            return res.status(403).json({ error: 'Permissão insuficiente.' });
          }

          req.id = user.id;
          next(); // Continua para o próximo middleware ou rota
        },
      );
    } catch (error) {
      res.status(500).json({ error: 'Erro no servidor.' });
      return;
    }
  };
};
