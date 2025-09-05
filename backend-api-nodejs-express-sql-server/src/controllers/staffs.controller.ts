
import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import staffservice from "../services/staffs.service";
import { httpStatus, sendJsonSuccess } from "../helpers/response.helper";
/**
 * controller:
 * nhận kết quả từ routes và xử lý logic
 * nhận kết quả từ service tương ứng với đầu vào từ routes
 * response keets quả cho client
 * không nên xử lý nghiêp vụ phức tạp trong controller
 */


const getAll = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const categories = await staffservice.getAll(req.query);
        sendJsonSuccess(res, categories);
    } catch (error) {
        next(error);
    }

}



const getStaffById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Convert string sang ObjectId

        const Staff = await staffservice.getStaffById(id);

        return sendJsonSuccess(res, Staff);
    } catch (error) {
        next(error);
    }
};
const createStaff = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const staff = await staffservice.createStaff(payload);
        sendJsonSuccess(res, staff, httpStatus.CREATED.statusCode, httpStatus.CREATED.message)
    } catch (error) {
        next(error);
    }
}

const updateStaffByID = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;
        // Convert string sang ObjectId
        const payload = req.body;
        const result = await staffservice.updateStaffByID(id, payload);
        sendJsonSuccess(res, result);
    } catch (error) {
        next(error);
    }
   
}

const deleteStaffByID = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await staffservice.deleteStaffByID(id);
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
    getStaffById,
    createStaff,
    updateStaffByID,
    deleteStaffByID
};


