
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
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";


const ProductRepository = myDataSource.getRepository(Product);
const CategoryRepository = myDataSource.getRepository("Category");
const BrandRepository = myDataSource.getRepository("Brand");



// ===== Upload ảnh lên Cloudinary =====
// upload lên cloudinary từ buffer
const uploadImageToCloud  = async (file: Express.Multer.File): Promise<string> => {
  if (!file) throw createHttpError(400, "No file uploaded");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products", resource_type: "image" },
      (err, result: UploadApiResponse | undefined) => {
        if (err || !result) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
};
// ==> PRIVATE ROUTES
const getAll = async (query: any) => {
    // đọc tham số từ query và chuẩn hóa
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Number(query?.limit) || 5);
    const skip = (page - 1) * limit;

    const [products, totalCount] = await ProductRepository.findAndCount({
        select: {
            id: true,
            product_name: true,
            thumbnail: true,
            price: true,
            discount: true,
            stock: true,
            sku: true,
            barcode: true,
            status: true,
            description: true,
            isFeatured: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            category: { category_id: true, category_name: true, description: true },
            brand: { brand_id: true, brand_name: true, description: true },
            // nếu muốn trả images thì phải JOIN quan hệ images:
            // images: { id: true, url: true, createdAt: true },
        },
        relations: {
            category: true,
            brand: true,
            // images: true, // bật nếu cần trả images
        },
        order: { id: 'DESC' },
        skip,
        take: limit,
    });

    return {
        pagination: {
            total: totalCount,
            page,
            limit,
        },
        products,
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



const createProduct = async (payload: IProductCreate, file?: Express.Multer.File) => {
    // 1. Kiểm tra category
    const category = await CategoryRepository.findOneBy({ category_id: Number(payload.category_id) });
    if (!category) {
        throw new Error(`Category with id ${payload.category_id} not found`);
    }

    // 2. Kiểm tra brand
    const brand = await BrandRepository.findOneBy({ brand_id: Number(payload.brand_id) });
    if (!brand) {
        throw new Error(`Brand with id ${payload.brand_id} not found`);
    }

    // 3. Validate
    if (typeof payload.discount !== "number" || payload.discount < 0 || payload.discount > 1000000) {
        throw new createHttpError.BadRequest("Discount must be a number between 0 and 1000000");
    }
    if (payload.price < 0) {
        throw new createHttpError.BadRequest("Price must be greater than 0");
    }

    // 4. Upload thumbnail nếu có file
    let thumbnailUrl = payload.thumbnail;
    if (file) {
        thumbnailUrl = await uploadImageToCloud(file);
    }

    // 5. Tạo product
    const product = ProductRepository.create({
        product_name: payload.product_name,
        thumbnail: thumbnailUrl,
        price: payload.price,
        discount: payload.discount,
        stock: payload.stock,
        sku: payload.sku,
        barcode: payload.barcode,
        status: payload.status,
        description: payload.description,
        isFeatured: payload.isFeatured ?? false,
        isActive: payload.isActive ?? true,
        createdBy: payload.createdBy ?? undefined,
        category,
        brand,
        images: payload.images ?? [],
    });

    return await ProductRepository.save(product);
};


// const createProduct = async (payload: IProductCreate) => {
//     // 1. Kiểm tra category
//     const category = await CategoryRepository.findOneBy({ category_id: Number(payload.category_id) });
//     if (!category) {
//         throw new Error(`Category with id ${payload.category_id} not found`);
//     }

//     // 2. Kiểm tra brand
//     const brand = await BrandRepository.findOneBy({ brand_id: Number(payload.brand_id) });
//     if (!brand) {
//         throw new Error(`Brand with id ${payload.brand_id} not found`);
//     }


//     if (typeof payload.discount !== 'number' || payload.discount < 0 || payload.discount > 1000000) {
//         throw new createHttpError.BadRequest('Discount must be a number between 0 and 1000000');
//     }
//     if (payload.price < 0) {
//         throw new createHttpError.BadRequest('Price must be greater than 0');
//     }



//     // 3. Tạo product
//     const product = ProductRepository.create({
//         product_name: payload.product_name,
//         thumbnail: payload.thumbnail,
//         price: payload.price,
//         discount: payload.discount,
//         stock: payload.stock,
//         sku: payload.sku,
//         barcode: payload.barcode,
//         status: payload.status,
//         description: payload.description,
//         isFeatured: payload.isFeatured ?? false,
//         isActive: payload.isActive ?? true,
//         createdBy: payload.createdBy ?? undefined,
//         category,
//         brand,
//         images: payload.images ?? [],
//     });


//     return await ProductRepository.save(product);
// };

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
    deleteProduct,
    uploadImageToCloud
    // other service methods can be added here
};


