import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { env } from '../helpers/env.helper';
import { Response } from 'express';
import bcrypt from 'bcrypt';
import { myDataSource } from '../databases/data-source';
import { Staff } from '../entities/staff.entity';

const staffRepository = myDataSource.getRepository(Staff);

const login = async (email: string, password: string) => {
    // 🔎 Kiểm tra email có tồn tại không
    const staff = await staffRepository.findOne({ where: { email } });
    if (!staff) {
        throw createError(404, 'Email or password is incorrect');
    }

    // 🔑 Kiểm tra mật khẩu (bcrypt hash)
    const isValid = await bcrypt.compare(password, staff.password);
    if (!isValid) {
        throw createError(400, 'Email or password is incorrect');
    }

    // 🎫 Tạo JWT token
    const accessToken = jwt.sign(
        { id: staff.staff_id, email: staff.email }, // dùng id thay vì _id
        env.JWT_SECRET as string,
        { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
        { id: staff.staff_id, email: staff.email },
        env.JWT_SECRET as string,
        { expiresIn: '365d' }
    );

    return { accessToken, refreshToken };
};

const getProfile = async (res: Response) => {
    const { staff } = res.locals;
    if (!staff) {
        throw createError(401, 'Unauthorized');
    }
    // Trả về staff nhưng loại bỏ password
    const { password, ...staffData } = staff;
    return staffData;
};

export default {
    login,
    getProfile,
};
