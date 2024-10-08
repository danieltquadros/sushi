import { Router } from "express";
import * as pingController from "../controllers/ping";
import * as authController from "../controllers/auth";
import * as productController from "../controllers/product";
import { verifyJWT } from "../utils/jwt";

export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);
mainRouter.get("/private-ping", verifyJWT(), pingController.privatePing);

mainRouter.post("/auth/signup", authController.signup);
mainRouter.post("/auth/sign-in", authController.signIn);

mainRouter.post(
  "/product",
  verifyJWT(["ADMIN"]),
  productController.createProduct
);
mainRouter.get("/product/:name", productController.getProductByName);
mainRouter.get("/product", productController.getProductList);
