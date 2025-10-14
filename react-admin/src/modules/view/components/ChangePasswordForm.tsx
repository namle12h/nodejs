import { useState } from "react";
import { axiosClient } from "../../../shared/lib/axiosClient";
import { message } from "antd";

export default function ChangePasswordForm() {
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            message.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosClient.put("/auth/change-password", form);
            message.success(res.data.message || "Đổi mật khẩu thành công!");
            setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            message.error(error.response?.data?.error || "Có lỗi xảy ra khi đổi mật khẩu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                Đổi mật khẩu
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        Mật khẩu cũ
                    </label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={form.oldPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        Xác nhận mật khẩu mới
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-lg py-2 mt-4 font-medium transition-all shadow-sm"
                >
                    {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
            </form>
        </div>

    );
}
