'use client'
import Header from "@/app/components/Header";
import { ClockCircleOutlined, UserOutlined, StarFilled } from "@ant-design/icons";
import { Button } from "antd";
import Head from "next/head";
import Image from "next/image";

export default function ServiceDetail() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <section className="bg-pink-50 py-16">

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

                    {/* LEFT CONTENT */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Chăm Sóc Da Mặt <span className="text-pink-600">Cao Cấp</span>
                        </h1>
                        <p className="text-lg text-gray-700 mb-6">
                            Liệu trình chăm sóc da mặt chuyên sâu với công nghệ hiện đại và sản phẩm cao cấp nhập khẩu,
                            mang lại làn da mịn màng, sáng khỏe và rạng rỡ tự nhiên.
                        </p>

                        {/* Info row */}
                        <div className="flex gap-12 mb-6">
                            <div>
                                <p className="flex items-center gap-2 font-semibold text-gray-800">
                                    <ClockCircleOutlined /> Thời Gian
                                </p>
                                <span className="text-gray-600">105 phút</span>
                            </div>
                            <div>
                                <p className="flex items-center gap-2 font-semibold text-gray-800">
                                    <UserOutlined className="text-pink-600" /> Phù Hợp
                                </p>
                                <span className="text-gray-600">Mọi loại da</span>
                            </div>
                        </div>

                        {/* Price + rating */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-2xl font-bold text-pink-700">650,000 VNĐ</span>
                            <div className="flex items-center text-yellow-400">
                                {Array(5).fill(0).map((_, i) => (
                                    <StarFilled key={i} />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">(248 đánh giá)</span>
                            </div>
                        </div>

                        {/* Button */}
                        <Button size="large" className="!bg-pink-500 text-white font-semibold">
                            Đặt Lịch Ngay
                        </Button>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="shadow-lg rounded-2xl overflow-hidden pt-10 w-fit h-fit">
                        <Image
                            src="/upload/detailservice1.jpg" // thay bằng ảnh của bạn
                            alt="Chăm sóc da mặt cao cấp"
                            width={1000}
                            height={400}
                            className="w-full h-full object-cover "
                        />
                    </div>
                </div>
            </section>
        </div>

    );
}
