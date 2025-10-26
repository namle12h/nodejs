import React from "react";
import { Card } from "antd";
import { SmileOutlined, HeartOutlined } from "@ant-design/icons";
import { GiDroplets, GiLeafSwirl } from "react-icons/gi";

const categories = [
  {
    id: 1,
    title: "Sữa Rửa Mặt",
    desc: "Làm sạch sâu, dịu nhẹ",
    icon: <SmileOutlined style={{ fontSize: 36, color: "#f43f5e" }} />,
    bg: "bg-pink-50",
  },
  {
    id: 2,
    title: "Serum",
    desc: "Dưỡng chất tinh túy",
    icon: <GiDroplets className="text-blue-500" size={40} />,
    bg: "bg-blue-50",
  },
  {
    id: 3,
    title: "Mặt Nạ",
    desc: "Cấp ẩm, phục hồi da",
    icon: <GiLeafSwirl className="text-green-500" size={40} />,
    bg: "bg-green-50",
  },
  {
    id: 4,
    title: "Kem Dưỡng",
    desc: "Bảo vệ, nuôi dưỡng",
    icon: <HeartOutlined style={{ fontSize: 36, color: "#a855f7" }} />,
    bg: "bg-purple-50",
  },
];

export default function ProductCategories() {
  return (
    <div className="py-12 text-center bg-white">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Danh Mục Sản Phẩm</h2>
      <p className="text-gray-500 mb-10">
        Tìm hiểu các dòng sản phẩm chăm sóc da chuyên nghiệp
      </p>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {categories.map((cat) => (
          <Card
            key={cat.id}
            className={`${cat.bg} rounded-2xl shadow-sm hover:shadow-md transition-all duration-300`}
            bordered={false}
          >
            <div className="flex flex-col items-center text-center space-y-3 py-6">
              <div className="p-3 rounded-full bg-white shadow-sm">
                {cat.icon}
              </div>
              <h3 className="font-semibold text-lg text-gray-800">
                {cat.title}
              </h3>
              <p className="text-gray-500 text-sm">{cat.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
