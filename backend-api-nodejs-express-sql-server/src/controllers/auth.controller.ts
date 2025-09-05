import { NextFunction } from "express";
import { Request, Response } from "express";
import authService from "../services/auth.service";
import { sendJsonSuccess } from "../helpers/response.helper";

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const tokens = await authService.login(email, password);
        sendJsonSuccess(res, tokens);
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const staff = await authService.getProfile(res);
        sendJsonSuccess(res, staff);
    }
    catch (error) {
        next(error)
    }
}

export default {
    login,
    getProfile
}