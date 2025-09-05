
/**
 * Service
 * -- nhận đầu vào từ controller
 * -- xử lý nghiệp vụ
 * -- trả về dữ liệu cho controller
 */

import createHttpError from "http-errors";
import { myDataSource } from "../databases/data-source";
import { buildSlug } from "../helpers/slugify.helper";
import { Product } from "../entities/product.entity";


const ProductRepository = myDataSource.getRepository(Product);


// ==> PRIVATE ROUTES
const getAll = async (query: any) => {

    const { page = 1, limit = 10 } = query;

    //Nếu tồn tại sortType và sortBy thì sẽ sắp xếp theo sortType và sortBy
    //Nếu không tồn tại thì sẽ sắp xếp theo createdAt
    let sortObject = {};
    const sortType = query.sort_type || 'desc';
    const sortBy = query.sort_by || 'Product_id';
    sortObject = { ...sortObject, [sortBy]: sortType === 'desc' ? -1 : 1 };

    console.log('<<=== 🚀sortObject  ===>>', sortObject);

    //Tìm kiếm theo điều kiện
    let where = {};
    //Nếu có tìm kiếm theo tên sản phẩm
    if (query.Product_name && query.Product_name.length > 0) {
        where = { ...where, Product_name: { $regex: query.Product_name, $options: 'i' } };
    }
    //Nếu tìm kiếm theo danh mục
    if (query.Product && query.Product.length > 0) {
        where = { ...where, Product: query.Product };
    }

    const products = await ProductRepository.find({
        where,
        order: sortObject,
        skip: (page - 1) * limit,
        take: limit
    });

    //Đếm tổng số record hiện có của collection Product
    const count = await ProductRepository.count({ where });

    return {
        products,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
};


const getProductById = async (id: number) => {
    const Product = await ProductRepository.findOne({ where: { id: id } });
    if (!Product) {
        throw createHttpError(404, "Product not found");
    }
    return Product;

}

const createProduct = async (payload: any) => {

     const product = await ProductRepository.insert(payload);
    return product;
    // tạo mới Product


}

const updateProduct = async (id: number, payload: any) => {
    const Product = await getProductById(id);

    try {
        /***
    * Kiểm tra xem tên sản phẩm bạn vừa đổi có khác với tên sản phẩm hiện tại không
    * Nếu khác thì kiểm tra xem có sản phẩm nào khác có tên giống không
    */
        if (payload.Product_name !== Product.product_name) {
            const ProductExist = await ProductRepository.findOne({ where: { product_name: payload.product_name } });
            if (ProductExist) {
                throw createHttpError(400, 'Product already exists');
            }
        }
        //câp nhật Product

        //cập nhật slug
        if (payload.Product_name) {
            payload.slug = buildSlug(payload.Product_name);
        }

        Object.assign(Product, payload); //trộn dữ liệu cũ và mới
        await ProductRepository.save(Product);
        return Product;
    } catch (error) {
        if (createHttpError.isHttpError?.(error)) {
            throw error;
        }
        throw createHttpError(500, "Internal Server Error");
    }

}

const deleteProduct = async (id: number) => {
    try {
        const ProductIndex = await ProductRepository.findOne({ where: { id: id } });
        if (!ProductIndex) {
            throw createHttpError(404, "Product not found");
        }
        await ProductRepository.remove(ProductIndex);

    } catch (error) {

        if (createHttpError.isHttpError?.(error)) {
            throw error;
        }
        throw createHttpError(500, "Internal Server Error");
    }

    return { message: "Product deleted successfully" };
}

export default {
    getAll,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
    // other service methods can be added here
};


