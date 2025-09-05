import createError from 'http-errors';
import { myDataSource } from '../databases/data-source';
import { Brand } from '../entities/brand.entity';
import { buildSlug } from '../helpers/slugify.helper';

const brandRepository = myDataSource.getRepository(Brand);

const getAll = async () => {
    const brands = await brandRepository.find();
    return brands;
}

const getById = (id: number) => {

    return null;
}

const create = async (payload: any) => {




    const brand = brandRepository.create({
        brand_name: payload.brand_name,
        description: payload.description,
        /* Nếu có truyền slug thì lấy, còn ko tự tạo từ brand name */
        slug: payload.slug && payload.slug !== '' ? payload.slug : buildSlug(payload.brand_name)
    });




    await brandRepository.save(brand);
    return brand;
}

const updateById = (id: number, payload: { id: number, name: string }) => {

    return null;
}

const deleteById = async (id: number) => {
    try {
        const brand = await brandRepository.findOne({ where: { brand_id: id } });
        if (!brand) throw createError.NotFound('Brand not found');
        await brandRepository.remove(brand);
    } catch (error) {
        throw createError.InternalServerError('Error deleting brand');
    }
};


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}