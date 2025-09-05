import createError from 'http-errors'
import jwt from 'jsonwebtoken';
import staffModel from '../models/staff.model';
import { env } from '../helpers/env.helper';
import { Response } from 'express';
import bcrypt from 'bcrypt';

const login = async (email: string, password: string) => {

    // logic đăng nhập
    // kiểm tra email có tồn tại không
    const staff = await staffModel.findOne({ email });
    if (!staff) {
        //báo lỗi chung chung 
        // lí do để hacker không đoán dc email 
        throw createError(404, 'email or password is incorrect');
    }
    // kiểm tra mật khẩu
    // nếu mật khẩu chưa được mã hóa 
    // if (staff.password !== password) {
    //     throw createError(404, 'email or password is incorrect');

    // }

    //Sử dụng hàm so sánh mật khẩu đã được mã hóa
    const passwordHash = staff.password;
    const isValid = await bcrypt.compare(password, passwordHash); // true
    if (!isValid) {
        //Đừng thông báo: Sai mật mật khẩu. Hãy thông báo chung chung
        throw createError(400, "Invalid email or password")
    }
    // login thành công
    // tạo token
    const accessToken = jwt.sign(
        { _id: staff._id, email: staff.email },
        env.JWT_SECRET as string,
        {
            expiresIn: '24h', // expires in 24 hours (24 x 60 x 60)
        }
    );

    const refreshToken = jwt.sign(
        { _id: staff._id, email: staff.email },
        env.JWT_SECRET as string,
        {
            expiresIn: '365d', // expires in 24 hours (24 x 60 x 60)
        }
    );
    return {
        accessToken,
        refreshToken
    }
}

const getProfile = async (res: Response) => {
    const { staff } = res.locals;
    //return without password
    return staff;
}
export default {
    login,
    getProfile
}