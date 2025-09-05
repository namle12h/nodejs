
/**
 * Service
 * -- nhận đầu vào từ controller
 * -- xử lý nghiệp vụ
 * -- trả về dữ liệu cho controller
 */

import createHttpError from "http-errors";
import { myDataSource } from "../databases/data-source";
import { buildSlug } from "../helpers/slugify.helper";
import { Category } from "../entities/category.entity";


const categoryRepository = myDataSource.getRepository(Category);


// ==> PRIVATE ROUTES
const getAll = async (query: any) => {

    const { page = 1, limit = 10 } = query;

    //Nếu tồn tại sortType và sortBy thì sẽ sắp xếp theo sortType và sortBy
    //Nếu không tồn tại thì sẽ sắp xếp theo createdAt
    let sortObject = {};
    const sortType = query.sort_type || 'desc';
    const sortBy = query.sort_by || 'category_id';
    sortObject = { ...sortObject, [sortBy]: sortType === 'desc' ? -1 : 1 };

    console.log('<<=== 🚀sortObject  ===>>', sortObject);

    //Tìm kiếm theo điều kiện
    let where = {};
    //Nếu có tìm kiếm theo tên sản phẩm
    if (query.category_name && query.category_name.length > 0) {
        where = { ...where, category_name: { $regex: query.category_name, $options: 'i' } };
    }
    //Nếu tìm kiếm theo danh mục
    if (query.category && query.category.length > 0) {
        where = { ...where, category: query.category };
    }

    const categories = await categoryRepository.find({
        where,
        order: sortObject,
        skip: (page - 1) * limit,
        take: limit
    });

    //Đếm tổng số record hiện có của collection Category
    const count = await categoryRepository.count({ where });

    return {
        categories,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
};


const getCategoryById = async (id: number) => {
    const category = await categoryRepository.findOne({ where: { category_id: id } });
    if (!category) {
        throw createHttpError(404, "Category not found");
    }
    return category;

}

const createCategory = async (payload: any) => {

    try {
        const newCategory = categoryRepository.create({
            category_name: payload.category_name,
            description: payload.description,
            slug: buildSlug(payload.category_name)
        });

        const exist = await categoryRepository.findOne({ where: { category_name: payload.category_name } });
        if (exist) {
            throw createHttpError(400, "Category already exists");
        }

        await categoryRepository.save(newCategory);
        return newCategory;
    } catch (error) {
        if (createHttpError.isHttpError?.(error)) {
            throw error;
        }
        throw createHttpError(500, "Internal Server Error");
    }

    // tạo mới category


}

const updateCategory = async (id: number, payload: any) => {
    const category = await getCategoryById(id);

    try {
         /***
     * Kiểm tra xem tên sản phẩm bạn vừa đổi có khác với tên sản phẩm hiện tại không
     * Nếu khác thì kiểm tra xem có sản phẩm nào khác có tên giống không
     */
    if (payload.category_name !== category.category_name) {
        const categoryExist = await categoryRepository.findOne({ where: { category_name: payload.category_name } });
        if (categoryExist) {
            throw createHttpError(400, 'Category already exists');
        }
    }
    //câp nhật category

    //cập nhật slug
    if (payload.category_name) {
        payload.slug = buildSlug(payload.category_name);
    }

    Object.assign(category, payload); //trộn dữ liệu cũ và mới
    await categoryRepository.save(category);
    return category;
    } catch (error) {
        if (createHttpError.isHttpError?.(error)) {
            throw error;
        }
        throw createHttpError(500, "Internal Server Error");   
    }
   
}

const deleteCategory = async (id: number) => {
    try {
        const categoryIndex = await categoryRepository.findOne({ where: { category_id: id } });
        if (!categoryIndex) {
            throw createHttpError(404, "Category not found");
        }
        await categoryRepository.remove(categoryIndex);

    } catch (error) {

        if (createHttpError.isHttpError?.(error)) {
            throw error;
        }
        throw createHttpError(500, "Internal Server Error");
    }

    return { message: "Category deleted successfully" };
}

export default {
    getAll,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
    // other service methods can be added here
};


