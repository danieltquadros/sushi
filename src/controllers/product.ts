import { Response } from 'express';
import { ExtendedRequest } from '../types/extended-request';
import { productSchema } from '../schemas/product';
import { createProduct, findProductByName } from '../services/product';

export const product = async (req: ExtendedRequest, res: Response) => {
  const safeData = productSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  const hasProduct = await findProductByName(safeData.data.name);
  if (hasProduct) {
    res.json({ error: 'Produto já cadastrado.' });
    return;
  }

  const newProduct = await createProduct({
    name: safeData.data.name,
    description: '',
    price: 10,
    imageUrl: '',
    stock: 100,
  });

  res.status(201).json({
    newProduct,
  });
  return;
};
