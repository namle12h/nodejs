
import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import categoriesService from "../services/categories.service";
import { sendJsonSuccess } from "../helpers/response.helper";
/**
 * controller:
 * nhận kết quả từ routes và xử lý logic
 * nhận kết quả từ service tương ứng với đầu vào từ routes
 * response keets quả cho client
 * không nên xử lý nghiêp vụ phức tạp trong controller
 */


const getAll = async (req: Request, res: Response,next: NextFunction) => {

    try {
        const categories = await categoriesService.getAll(req.query);
        sendJsonSuccess(res, categories);
    } catch (error) {
        next(error);
    }

}



const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const categoryId = Number(id);
        const category = await categoriesService.getCategoryById(categoryId);

        return    sendJsonSuccess(res, category);
    } catch (error) {
         next(error);
    }
};
const createCategory = async (req: Request, res: Response) => {
    console.log(req.body);
    const payload = req.body;
    const newCategory = await categoriesService.createCategory(payload);
    res.status(201).json({
        message: "Category created successfully",
        data: newCategory, // trả về category mới đã tạo
    });
}

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;
    // Convert string sang ObjectId
    const category_id = Number(id);
    const payload = req.body;
    const result = await categoriesService.updateCategory(category_id, payload);
    res.status(200).json(result);
}

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category_id = Number(id);
    try {
        const result = await categoriesService.deleteCategory(category_id);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.status) {
            next(error);
        }
        else {
            next(createError(500, "Internal Server Error"));
        }
    }
}

export default {
    getAll,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};


