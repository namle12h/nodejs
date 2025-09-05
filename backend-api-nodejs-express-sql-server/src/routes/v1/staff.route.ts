import express from "express";

import staffsController from "../../controllers/staffs.controller";
import validateSchemaYup from "../../middlewares/validate.middleware";
import createValidation from "../../validations/staffs.validation";

const router = express.Router();

router.get("/staffs",validateSchemaYup(createValidation.getAllSchema), staffsController.getAll);

router.get("/staffs/:id", validateSchemaYup(createValidation.getByIdSchema), staffsController.getStaffById);

router.post("/staffs",validateSchemaYup(createValidation.createSchema), staffsController.createStaff);

router.put("/staffs/:id", validateSchemaYup(createValidation.updateByIdSchema), staffsController.updateStaffByID);

router.delete("/staffs/:id", staffsController.deleteStaffByID);

export default router;


// + =>> resource =  bao gồm nhiều phương thức 