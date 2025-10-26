import { Button, Rate, Card, Spin } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import Header from "../../../shared/components/Header";
import { useServiceById } from "../../../shared/services/serviceApi";
import { useParams } from "react-router-dom";
export default function HeadServiceDetail() {
    const { id } = useParams();

    const { data: service, isLoading, isError } = useServiceById(Number(id));
    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );

    if (isError || !service)
        return (
            <div className="text-center mt-20 text-red-600">
                ❌ Không tìm thấy thông tin dịch vụ.
            </div>
        );
    return (
        <div> <Header />
            <div className=" pt-20  bg-pink-50 flex justify-center items-center px-6">
                <Card
                    className="max-w-7xl  rounded-2xl shadow-lg  from-pink-50 !border-none to-white"
                    style={{ background: "transparent", boxShadow: "none" }}
                    styles={{body:{ padding: "2rem 3rem" }}}
                >
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        {/* LEFT CONTENT */}
                        <div>
                            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                                {service.name} <span className="text-pink-600">Cao Cấp</span>
                            </h1>
                            <p className="text-gray-700 mb-6 leading-relaxed text-[17px]">
                                {service.description ||
                                    " Liệu trình chăm sóc da mặt chuyên sâu với công nghệ hiện đại và sản phẩm cao cấp nhập khẩu, mang lại làn da mịn màng, sáng khỏe và rạng rỡ tự nhiên"}
                            </p>

                            <div className="flex items-center gap-20 mb-6">

                                <div className="flex items-center gap-2 text-gray-700">
                                    <ClockCircleOutlined className="!text-pink-500 text-xl " />
                                    <div>
                                        <p className="font-semibold">Thời Gian</p>
                                        <p>{service.durationMin} phút</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-700">
                                    <UserOutlined className="!text-pink-500 text-xl" />
                                    <div>
                                        <p className="font-semibold">Phù Hợp</p>
                                        <p>Mọi loại da</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl font-bold text-pink-600">{service.price.toLocaleString("vi-VN")} VNĐ</span>
                                <Rate disabled defaultValue={5} className="text-yellow-400" />
                                <span className="text-gray-500">(248 đánh giá)</span>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                className="!bg-pink-600 hover:!bg-pink-700 rounded-xl px-8 py-5 text-lg font-semibold"
                            >
                                Đặt Lịch Ngay
                            </Button>
                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="flex justify-center">
                            <img
                                src={service.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                                alt="Facial care"
                                className="rounded-3xl shadow-lg w-full h-120 object-cover"
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
