import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { getPublicURL } from '../utils/url';

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (user) {
    return {
      ...user,
      avatar: getPublicURL(user.avatar || ''),
    };
  }

  return null;
};

export const findUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id },
  });

  if (user) {
    return {
      ...user,
      avatar: getPublicURL(user.avatar || ''),
    };
  }

  return null;
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  const newUser = await prisma.user.create({ data });

  return {
    ...newUser,
    avatar: getPublicURL(newUser.avatar || ''),
  };
};
