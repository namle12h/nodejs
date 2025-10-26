import React from "react";
import { Card, Rate } from "antd";

const viewedProducts = [
  {
    id: 1,
    name: "Serum Hyaluronic Acid Skinceuticals",
    price: 1890000,
    oldPrice: 2100000,
    rating: 4,
    reviews: 67,
    image: "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1760615488/spring_services/npbeco6aewh3vmqmgaea.jpg",
  },
  {
    id: 2,
    name: "Kem Chống Nắng Skinceuticals SPF 50",
    price: 1650000,
    oldPrice: 1850000,
    rating:"https://res.cloudinary.com/dtxcwdf7r/image/upload/v1760615488/spring_services/npbeco6aewh3vmqmgaea.jpg",
  },
  {
    id: 3,
    name: "Toner Vitamin C Brightening",
    price: 1250000,
    oldPrice: 1400000,
    rating: 4,
    reviews: 89,
    image: "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1760615488/spring_services/npbeco6aewh3vmqmgaea.jpg",
  {
    id: 4,
    name: "Serum Retinol Anti-Aging",
    price: 2150000,
    oldPrice: 2350000,
    rating: 5,
    reviews: 156,
    image: "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1760615488/spring_services/npbeco6aewh3vmqmgaea.jpg",
  },
];

const formatVND = (:any) =>
  v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function ViewedProducts() {
  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Sản phẩm đã xem
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {viewedProducts.map((item) => (
          <Card
            key={item.id}
            hoverable
            className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            cover={
              <img
                alt={item.name}
                src={item.image}
                className="object-cover rounded-t-xl h-72 w-full"
              />
            }
          >
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-gray-700">{item.name}</h3>
              <div className="flex justify-center items-center gap-1">
                <Rate disabled defaultValue={item.rating} />
                <span className="text-sm text-gray-500">
                  ({item.reviews})
                </span>
              </div>
              <div className="flex justify-center items-end gap-2">
                <p className="text-pink-600 font-bold text-lg">
                  {formatVND(item.price)}
                </p>
                <p className="line-through text-gray-400 text-sm">
                  {formatVND(item.oldPrice)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
