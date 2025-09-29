import { Input, Button } from "antd";
import { FacebookFilled, InstagramFilled, YoutubeFilled } from "@ant-design/icons";
import { FaTiktok } from "react-icons/fa";
import { MdSpa } from "react-icons/md";

export default function Footer() {
    return (
        <footer className="bg-[#0f172a] text-gray-300 pt-12 pb-6">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Cột 1: Logo */}
                <div>
                    <div className="flex items-center">
                        <MdSpa className="text-pink-500 text-2xl mr-2" />
                        <span className="text-xl font-bold text-pink-500">Bella Spa</span>
                    </div>

                    <p className="text-gray-400 mb-4">
                        Địa chỉ làm đẹp tin cậy với dịch vụ spa chuyên nghiệp và không gian thư giãn tuyệt vời.
                    </p>
                    <div className="flex gap-4 text-pink-500 text-lg">
                        <FacebookFilled />
                        <InstagramFilled />
                        <YoutubeFilled />
                        <FaTiktok />
                    </div>
                </div>

                {/* Cột 2: Thông tin liên hệ */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Thông Tin Liên Hệ</h4>
                    <p>📍 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                    <p>📞 0901 234 567</p>
                    <p>📧 info@bellaspa.vn</p>
                </div>

                {/* Cột 3: Giờ làm việc */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Giờ Làm Việc</h4>
                    <p>Thứ 2 - Thứ 6: <span className="text-white">8:00 - 22:00</span></p>
                    <p>Thứ 7 - Chủ Nhật: <span className="text-white">8:00 - 23:00</span></p>
                    <p>Lễ, Tết: <span className="text-white">9:00 - 21:00</span></p>
                </div>

                {/* Cột 4: Nhận ưu đãi */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Nhận Ưu Đãi</h4>
                    <p className="text-gray-400 mb-4">Đăng ký để nhận thông tin khuyến mãi và ưu đãi đặc biệt</p>
                    <Input placeholder="Nhập email của bạn" className="mb-3 bg-gray-800 border-none text-gray-200" />
                    <Button type="primary" className="!bg-pink-600 w-full">Đăng Ký Ngay</Button>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-4">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    {/* Bên trái */}
                    <p>© 2024 Bella Spa. Tất cả quyền được bảo lưu.</p>

                    {/* Bên phải */}
                    <div className="flex gap-4 mt-2 md:mt-0">
                        <a href="#" className="hover:text-gray-300">Chính Sách Bảo Mật</a>
                        <a href="#" className="hover:text-gray-300">Điều Khoản Sử Dụng</a>
                        <a href="#" className="hover:text-gray-300">Sitemap</a>
                    </div>
                </div>
            </div>


        </footer>
    );
}
