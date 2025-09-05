import { NextFunction, Request, Response } from 'express';
import { httpStatus, sendJsonSuccess } from '../helpers/response.helper';
import productsService from '../services/products.service';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productsService.getAll(req.query);
        sendJsonSuccess(res, products);
    } catch (error) {
        next(error);
    }
}

const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const product_id = Number(id);
        const product = await productsService.getProductById(product_id);
        sendJsonSuccess(res, product);
    } catch (error) {
        next(error);
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const product = await productsService.createProduct(payload);
        sendJsonSuccess(res, product, httpStatus.CREATED.statusCode, httpStatus.CREATED.message)
    } catch (error) {
        next(error);
    }
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const product_id = Number(id);
        const payload = req.body;
        const product = await productsService.updateProduct(product_id, payload);
        sendJsonSuccess(res, product);
    } catch (error) {
        next(error);
    }
}

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const product_id = Number(id);
        const product = await productsService.deleteProduct(product_id);
        sendJsonSuccess(res, product);
    } catch (error) {
        next(error);
    }
}

export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}