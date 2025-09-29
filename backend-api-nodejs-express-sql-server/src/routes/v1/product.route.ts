import express from "express";

import productsController from "../../controllers/products.controller";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload";


const router = express.Router();

router.get("/products", authenticateToken, productsController.getAll);

router.get("/products/:id", authenticateToken, productsController.getById);

// router.post("/products", authenticateToken, productsController.create);
router.post(
  "/products/upload",
  authenticateToken,
  upload.single("image"),
  productsController.uploadImage
);


router.put("/products/:id", authenticateToken, productsController.updateById);

router.delete("/products/:id", authenticateToken, productsController.deleteById);


export default router;


// + =>> resource =  bao gồm nhiều phương thức 