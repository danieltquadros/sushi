import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { productSchema } from "../schemas/product";
import {
  createNewProduct,
  findProductByName,
  findProductList,
} from "../services/product";

export const createProduct = async (req: ExtendedRequest, res: Response) => {
  const safeData = productSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  const hasProduct = await findProductByName(safeData.data.name);
  if (hasProduct) {
    res.json({ error: "Produto já cadastrado." });
    return;
  }

  const newProduct = await createNewProduct({
    name: safeData.data.name,
    description: "",
    price: 10,
    imageUrl: "",
    stock: 100,
  });

  res.status(201).json({
    newProduct,
  });
  return;
};

export const getProductByName = async (req: ExtendedRequest, res: Response) => {
  const { name } = req.params;

  const product = await findProductByName(name);
  if (!product) {
    res.json({ error: "Produto não encontrado" });
    return;
  }

  res.json({ product });
  return;
};

export const getProductList = async (req: ExtendedRequest, res: Response) => {
  const productList = await findProductList();

  res.json(productList);
};
