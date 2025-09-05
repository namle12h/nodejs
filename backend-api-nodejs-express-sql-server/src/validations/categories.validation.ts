import * as yup from 'yup';

const createSchema = yup.object({
    body: yup.object({
        category_name: yup.string().min(3).max(50).required(),
        description: yup.string().max(255).optional(),
    })
})

const getAllSchema = yup
    .object({
        query: yup.object({
            page: yup.number().integer().positive().optional(), // positive là số nguyên dương
            limit: yup.number().integer().positive().optional(),
        }),
        sort_by: yup.string().matches(/^(asc|desc)$/).optional(),
        sort_type: yup.string().matches(/^(createdAt|category_name)$/).optional(),
        keyword: yup.string().min(3).max(50).optional(), //search category_name
    })
    .required();


const getByIdSchema = yup
    .object({
        params: yup.object({
            id: yup.number().required(),
        }),
    })
    .required();


const updateByIdSchema = yup
    .object({
        params: yup.object({
            id: yup.number().required(),
        }),
        body: yup.object({
            category_name: yup.string().min(3).max(50).optional(),
            description: yup.string().max(255).optional(),
        }),
    }).required();

const deleteByIdSchema = yup
    .object({
        params: yup.object({
            id: yup.number().required(),
        }),
    }).required();

export default {
    createSchema,
    getByIdSchema,
    updateByIdSchema,
    getAllSchema,
    deleteByIdSchema
}