
/**
 * Service
 * -- nhận đầu vào từ controller
 * -- xử lý nghiệp vụ
 * -- trả về dữ liệu cho controller
 */

import createHttpError from "http-errors";
import { IStaffCreate } from "../types/model";
import { myDataSource } from "../databases/data-source";
import { Staff } from "../entities/staff.entity";

const staffRepository = myDataSource.getRepository(Staff); // dùng để truy cập vào bảng staff

// ==> PRIVATE ROUTES
const getAll = async (query: any) => {

    const { page = 1, limit = 10 } = query;

    //Nếu tồn tại sortType và sortBy thì sẽ sắp xếp theo sortType và sortBy
    //Nếu không tồn tại thì sẽ sắp xếp theo createdAt
    let sortObject = {};
    const sortType = query.sort_type || 'desc';
    const sortBy = query.sort_by || 'staff_id';
    sortObject = { ...sortObject, [sortBy]: sortType === 'desc' ? -1 : 1 };

    console.log('<<=== 🚀sortObject  ===>>', sortObject);

    //Tìm kiếm theo điều kiện
    let where = {};
    //Nếu có tìm kiếm theo tên sản phẩm
    if (query.Staff_name && query.Staff_name.length > 0) {
        where = { ...where, Staff_name: { $regex: query.Staff_name, $options: 'i' } };
    }
    //Nếu tìm kiếm theo danh mục
    if (query.Staff && query.Staff.length > 0) {
        where = { ...where, Staff: query.Staff };
    }

    const staffs = await staffRepository.find({
        where,
        order: sortObject,
        skip: (page - 1) * limit,
        take: limit
    });

    return {
        staffs
    };
};


const getStaffById = async (id: string) => {
    return []

}

const createStaff = async (payload: any) => {
    //Kiểm tra email có tồn tại không
    const staff = staffRepository.create(payload);

    await staffRepository.save(staff);

    return staff;
}

const updateStaffByID = async (id: string, payload: any) => {
    const staff = await getStaffById(id);

    /***
     * Kiểm tra xem tên sản phẩm bạn vừa đổi có khác với tên sản phẩm hiện tại không
     * Nếu khác thì kiểm tra xem có sản phẩm nào khác có tên giống không
     */

    //kiểm tra email có tồn tại không



    //câp nhật Staff


    return staff;
}

const deleteStaffByID = async (id: string) => {


    return { message: "Staff deleted successfully" };
}

export default {
    getAll,
    getStaffById,
    createStaff,
    updateStaffByID,
    deleteStaffByID
    // other service methods can be added here
};


