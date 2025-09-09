
/**
 * Service
 * -- nhận đầu vào từ controller
 * -- xử lý nghiệp vụ
 * -- trả về dữ liệu cho controller
 */

import createHttpError from "http-errors";
import { myDataSource } from "../databases/data-source";
import { Product } from "../entities/product.entity";
import { IProductCreate } from "../types/model";


const ProductRepository = myDataSource.getRepository(Product);
const CategoryRepository = myDataSource.getRepository("Category");
const BrandRepository = myDataSource.getRepository("Brand");


// ==> PRIVATE ROUTES
const getAll = async (query: any) => {

    const [products, totalCount] = await ProductRepository.findAndCount({
        select: {
            id: true,
            product_name: true,
            price: true,
            discount: true,
            stock: true,
            category: {
                category_id: true,
                category_name: true
            },
            brand: {
                brand_id: true,
                brand_name: true
            }
        },
        relations: {
            category: true,
            brand: true
        },
        order: {
            id: 'DESC'
        },
        skip: 0,
        take: 10
    });

    return {
        pagination: {
            total: totalCount,
            page: 1,
            limit: 10
        },
        products
    };
};


const getProductById = async (id: number) => {
    //check tồn tai id
    const product = await ProductRepository.findOne({
        select: {
            id: true,
            product_name: true,
            description: true,
            price: true,
            discount: true,
            stock: true,
            category: {
                category_id: true,
                category_name: true
            },
            brand: {
                brand_id: true,
                brand_name: true
            }
        },
        where: {
            id
        }
    });
    if (!product) {
        throw new createHttpError.BadRequest('Product not found');
    }
    return product;
}

const createProduct = async (payload: IProductCreate) => {
  // 1. Kiểm tra category
  const category = await CategoryRepository.findOneBy({ category_id: Number(payload.category) });
  if (!category) {
    throw new Error(`Category with id ${payload.category} not found`);
  }

  // 2. Kiểm tra brand
  const brand = await BrandRepository.findOneBy({ brand_id: Number(payload.brand) });
  if (!brand) {
    throw new Error(`Brand with id ${payload.brand} not found`);
  }


  if(payload.discount < 0 || payload.discount > 100) {
    throw new createHttpError.BadRequest('Discount must be between 0 and 100');
  }
  if(payload.price < 0) {
    throw new createHttpError.BadRequest('Price must be greater than 0');
    }


  // 3. Tạo product
  const product = ProductRepository.create({
    product_name: payload.product_name, // ⚠️ entity nên để camelCase: productName
    price: payload.price,
    discount: payload.discount,
    description: payload.description,
    stock: payload.stock,
    category,
    brand,
  });

  return await ProductRepository.save(product);
};

const updateProduct = async (id: number, payload: any) => {
     //Kiem tinh ton tai truoc
  const product = await getProductById(id);
  //Cap nhat merge objects
  Object.assign(product, payload);
  //save lai
  const updated = await ProductRepository.save(product)
  return updated
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


