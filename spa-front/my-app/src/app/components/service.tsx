"use client";
import { Card, Button } from "antd";

const { Meta } = Card;

const services = [
  {
    id: 1,
    title: "Massage Thư Giãn Toàn Thân",
    desc: "Massage thư giãn với tinh dầu thiên nhiên giúp giảm căng thẳng và mệt mỏi",
    price: "450,000 VNĐ",
    image: "/upload/service1.jpg",
  },
  {
    id: 2,
    title: "Chăm Sóc Da Mặt Cao Cấp",
    desc: "Liệu trình chăm sóc da mặt chuyên sâu với công nghệ hiện đại",
    price: "650,000 VNĐ",
    image: "/upload/service2.jpg",
  },
  {
    id: 3,
    title: "Tắm Trắng Toàn Thân",
    desc: "Liệu trình tắm trắng an toàn với thành phần tự nhiên",
    price: "800,000 VNĐ",
    image: "/upload/service3.jpg",
  },
  {
    id: 4,
    title: "Triệt Lông Công Nghệ Cao",
    desc: "Công nghệ triệt lông hiện đại, an toàn và hiệu quả",
    price: "350,000 VNĐ",
    image: "/upload/service4.jpg",
  },
  {
    id: 5,
    title: "Gội Đầu Dưỡng Sinh",
    desc: "Gội đầu massage thư giãn với thảo dược thiên nhiên",
    price: "280,000 VNĐ",
    image: "/upload/service5.jpg",
  },
  {
    id: 6,
    title: "Liệu Trình Detox Cơ Thể",
    desc: "Thanh lọc cơ thể với liệu pháp thảo dược tự nhiên",
    price: "950,000 VNĐ",
    image: "/upload/service5.jpg",
  },
];

export default function FeaturedServices() {
  return (
    <section className="py-16 bg-gray-50 ">
      <div className="container mx-auto px-4 max-w-[1200px]">
        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Dịch Vụ Nổi Bật
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Khám phá các liệu trình spa chuyên nghiệp được thiết kế để mang lại
            sự thư giãn tối đa và làm đẹp hoàn hảo
          </p>
        </div>

        {/* Grid dịch vụ */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card
              key={s.id}
              hoverable
              cover={
                <img
                  alt={s.title}
                  src={s.image}
                  className="h-56 w-full object-cover"
                />
              }
              className="shadow-md rounded-xl overflow-hidden"
            >
              <Meta
                title={<span className="font-semibold text-lg">{s.title}</span>}
                description={<p className="text-gray-600">{s.desc}</p>}
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-pink-600 font-bold">{s.price}</span>
                <Button type="primary">Xem Chi Tiết</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
