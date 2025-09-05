import * as yup from 'yup';

const loginSchema = yup.object({
    body: yup.object({
        email: yup.string().email().required(),
        password: yup.string().min(6).max(100).required(),
    })
})

const getAllSchema = yup
  .object({
    query: yup.object({
      page: yup.number().integer().positive().optional(), // positive là số nguyên dương
      limit: yup.number().integer().positive().optional(),}),
      sort_by: yup.string().matches(/^(asc|desc)$/).optional(),
      sort_type: yup.string().matches(/^(createdAt|category_name)$/).optional(),
      keyword: yup.string().min(3).max(50).optional(), //search category_name
  })
  .required();


const getByIdSchema = yup
    .object({
        params: yup.object({
            id: yup.string().matches(/^[0-9a-fA-F]{24}$/, { message: 'ID is non-Objectid' }).required(),
        }),
    })
    .required();


const updateByIdSchema = yup
    .object({
        params: yup.object({
            id: yup.string().matches(/^[0-9a-fA-F]{24}$/, { message: 'ID is non-Objectid' }).required(),
        }),
        body: yup.object({
            category_name: yup.string().min(3).max(50).optional(),
            description: yup.string().max(255).optional(),
        }),
    }).required();

export default {
    loginSchema,
    getByIdSchema,
    updateByIdSchema,
    getAllSchema
}