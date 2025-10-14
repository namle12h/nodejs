import { useState, useEffect } from "react";
import { axiosClient } from "../../../shared/lib/axiosClient"; // import axios config có token sẵn
import { message } from "antd";

export default function ProfileForm() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        birthday: "",
        gender: "",
        address: "",
        city: "",
        country: "",
        createdAt:"",
    });

    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosClient.get("/auth/get-profile");
                const user = res.data.user;
                setForm({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    birthday: user.dob ? user.dob.split("T")[0] : "",
                    gender: user.gender || "Khác",
                    address: user.address || "",
                    city: user.city || "",
                    country: user.country || "Việt Nam",
                    createdAt:user.createdAt || ""
                });
            } catch (error) {
                console.error("Lỗi khi tải thông tin user:", error);
                messageApi.error("Không thể tải thông tin người dùng!");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // 🟦 2. Hàm xử lý khi nhấn “Cập nhật thông tin”
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const payload = {
                name: form.name,
                phone: form.phone,
                address: form.address,
                gender: form.gender,
                dob: form.birthday,
            };
            const res = await axiosClient.put("/auth/update-profile", payload);
            messageApi.success(res.data.message || "Cập nhật thành công!");
            console.log("Payload gửi lên:", payload);

        } catch (error: any) {
            console.error("Lỗi khi cập nhật:", error);
            messageApi.error(error.response?.data?.error || "Có lỗi xảy ra khi cập nhật!");
        }
    };

    if (loading) return <div>Đang tải thông tin...</div>;

    return (

        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl">
            <h2 className="text-2xl font-semibold mb-6">Thông tin cá nhân</h2>
            {contextHolder}
            <div className="flex items-center gap-4 mb-6">
                <img
                    src="https://i.pravatar.cc/100"
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover border"
                />
                <div>
                    <h3 className="text-lg font-semibold">{form.name}</h3>
                    <p className="text-gray-500">{form.email}</p>
                    <p className="text-sm text-gray-400">Thành viên từ tháng {new Date(form.createdAt).toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" })}</p>
                </div>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Họ và tên *</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150 px-3 py-2 outline-none text-gray-700 placeholder-gray-400"

                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Giới tính</label>
                    <div className="flex items-center gap-4 mt-2">
                        {["Nam", "Nữ", "Khác"].map((g) => (
                            <label key={g} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value={g}
                                    checked={form.gender === g}
                                    onChange={() => setForm({ ...form, gender: g })}
                                />
                                {g}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                        type="email"
                        value={form.email}
                        readOnly
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150 px-3 py-2 outline-none text-gray-700 placeholder-gray-400"

                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                    <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150 px-3 py-2 outline-none text-gray-700 placeholder-gray-400"

                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                    <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150 px-3 py-2 outline-none text-gray-700 placeholder-gray-400"

                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                    <input
                        type="date"
                        value={form.birthday}
                        onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150 px-3 py-2 outline-none text-gray-700 placeholder-gray-400"

                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Thành phố</label>
                    <select
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150 px-3 py-2 outline-none text-gray-700 placeholder-gray-400"

                    >
                        <option>Hồ Chí Minh</option>
                        <option>Hà Nội</option>
                        <option>Đà Nẵng</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Quốc gia</label>
                    <select
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150 px-3 py-2 outline-none text-gray-700 placeholder-gray-400"

                    >
                        <option>Việt Nam</option>
                        <option>Hoa Kỳ</option>
                        <option>Nhật Bản</option>
                    </select>
                </div>
            </form>

            {/* Buttons */}
            <div className="mt-8 flex gap-3">
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                >
                    Cập nhật thông tin
                </button>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="border-green-300 bg-green-400 hover:bg-green-500 px-6 py-2 rounded-md  text-white"

                >
                    Loading
                </button>
            </div>
        </div>
    );
}
