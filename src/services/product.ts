import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
// import { getPublicURL } from "../utils/url";

export const createNewProduct = async (data: Prisma.ProductCreateInput) => {
  const newProduct = await prisma.product.create({ data });

  return newProduct;
};

export const findProductByName = async (name: string) => {
  const product = await prisma.product.findFirst({
    where: { name },
  });

  if (product) {
    return product;
  }

  return null;
};

export const findProductList = async () => {
  const productList = await prisma.product.findMany();

  return productList;
};
