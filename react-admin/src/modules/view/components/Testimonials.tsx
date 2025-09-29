import { Rate } from "antd";

const testimonials = [
    {
        name: "Nguyễn Thị Lan",
        image: "/upload/customer1.jpg",
        rating: 5,
        content:
            '“Dịch vụ tuyệt vời, nhân viên chuyên nghiệp và tận tình. Tôi cảm thấy rất thư giãn sau liệu trình massage.”',
    },
    {
        name: "Trần Minh Hương",
        image: "/upload/customer2.jpg",
        rating: 5,
        content:
            "“Không gian spa rất đẹp và sạch sẽ. Liệu trình chăm sóc da mặt giúp da tôi trở nên mịn màng hơn rất nhiều.”",
    },
    {
        name: "Lê Thị Mai",
        image: "/upload/customer3.jpg",
        rating: 5,
        content:
            "“Giá cả hợp lý, chất lượng dịch vụ xuất sắc. Tôi sẽ quay lại và giới thiệu cho bạn bè.”",
    },
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                {/* Tiêu đề */}
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    Khách Hàng <span className="text-pink-600">Nói Gì</span>
                </h2>
                <p className="text-gray-600 mb-12">
                    Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của chúng tôi
                </p>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-pink-50 p-6 rounded-2xl shadow hover:shadow-lg transition"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={t.image}
                                    alt={t.name}
                                    width={60}
                                    height={60}
                                    className="rounded-full object-cover"
                                />
                                <div className="text-left">
                                    <h4 className="font-semibold text-gray-800">{t.name}</h4>
                                    <Rate disabled defaultValue={t.rating} className="text-yellow-500 text-sm" />
                                </div>
                            </div>
                            <p className="text-gray-700 italic">{t.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
