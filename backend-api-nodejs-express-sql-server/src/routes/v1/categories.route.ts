import express from "express";

import categoriesController from "../../controllers/categories.controller";
import validateSchemaYup from "../../middlewares/validate.middleware";
import createValidation from "../../validations/categories.validation";

const router = express.Router();

router.get("/categories",validateSchemaYup(createValidation.getAllSchema), categoriesController.getAll);

router.get("/categories/:id", validateSchemaYup(createValidation.getByIdSchema), categoriesController.getCategoryById);

router.post("/categories",validateSchemaYup(createValidation.createSchema), categoriesController.createCategory);

router.put("/categories/:id", validateSchemaYup(createValidation.updateByIdSchema), categoriesController.updateCategory);

router.delete("/categories/:id", categoriesController.deleteCategory);

export default router;


// + =>> resource =  bao gồm nhiều phương thức 