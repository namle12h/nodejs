
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
import bcrypt from "bcrypt";


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

const createStaff = async (payload: IStaffCreate) => {
    // Kiểm tra email đã tồn tại chưa
    const existingStaff = await staffRepository.findOne({ where: { email: payload.email } });
    if (existingStaff) {
        throw createHttpError(400, "Email already exists");
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    // Tạo staff mới với password đã hash
    const staff = staffRepository.create({
        ...payload,
        password: hashedPassword,
    });

    await staffRepository.save(staff);

    // Ẩn password khi trả về
    const { password, ...result } = staff;
    return result;
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

    await getStaffById(id); // kiểm tra xem Staff có tồn tại không

    const result = await staffRepository.delete(id);

    if (result.affected === 0) {
        throw createHttpError(404, "Staff not found");
    }

    return { message: "Staff deleted successfully", ...result };
}

export default {
    getAll,
    getStaffById,
    createStaff,
    updateStaffByID,
    deleteStaffByID
    // other service methods can be added here
};


