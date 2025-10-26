import  { useState } from "react";
import { Rate, InputNumber, Button, Tag } from "antd";
import { HeartOutlined, ShareAltOutlined, ShoppingCartOutlined } from "@ant-design/icons";

export default function ProductDetailHead() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);

  const product = {
    name: "Serum Vitamin C Skinceuticals CE Ferulic",
    desc: "Serum chống oxy hóa cao cấp với 15% L-Ascorbic Acid",
    price: 2450000,
    oldPrice: 2650000,
    stock: 25,
    rating: 4,
    reviews: 89,
    images: [
      "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1760625819/spring_services/g0dcj3uwierac5rx7m5o.jpg",
      "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1760615488/spring_services/npbeco6aewh3vmqmgaea.jpg",
      "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1760625636/spring_services/axb5qppulsmnm6todl79.jpg",
      "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1760625819/spring_services/g0dcj3uwierac5rx7m5o.jpg",

    ],
  };

  const formatVND = (v:any) =>
    v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="container mx-auto py-10 px-6 grid lg:grid-cols-2 gap-10">
      {/* LEFT IMAGE */}
      <div>
        <div className="relative">
          <img
            src={product.images[selectedImg]}
            alt={product.name}
            className="rounded-lg shadow-md shadow-gray-700 w-auto h-130 object-contain"
          />
          <Tag color="purple" className="absolute top-3 right-3">
            Premium
          </Tag>
        </div>

        <div className="flex gap-3 mt-4">
          {product.images.map((img, index) => (
            <div
              key={index}
              className={`cursor-pointer border-2 rounded-md ${
                selectedImg === index
                  ? "border-pink-500"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => setSelectedImg(index)}
            >
              <img
                src={img}
                alt=""
                className="w-20 h-20 object-cover rounded-md"
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT DETAILS */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{product.name}</h1>
        <p className="text-gray-500 mb-3">{product.desc}</p>
        <div className="flex items-center gap-2 mb-4">
          <Rate disabled defaultValue={product.rating} />
          <span className="text-gray-600 text-sm">
            ({product.reviews} đánh giá)
          </span>
        </div>

        <div className="flex items-end gap-3 mb-4">
          <p className="text-pink-600 text-2xl font-bold">
            {formatVND(product.price)}
          </p>
          <p className="line-through text-gray-400">
            {formatVND(product.oldPrice)}
          </p>
          <Tag color="red">Tiết kiệm {formatVND(product.oldPrice - product.price)}</Tag>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <p className="text-gray-700">Số lượng:</p>
          <InputNumber
            min={1}
            max={product.stock}
            value={quantity}
            // onChange={setQuantity}
          />
          <p className="text-gray-400 text-sm">
            Còn lại: {product.stock} sản phẩm
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            className="bg-pink-500 hover:bg-pink-600 border-none"
          >
            Thêm vào giỏ
          </Button>
          <Button size="large" className="border-pink-500 text-pink-500 hover:bg-pink-50">
            Xem chi tiết
          </Button>
        </div>

        <div className="flex gap-3 mb-8">
          <Button icon={<HeartOutlined />} className="border-gray-300">
            Yêu thích
          </Button>
          <Button icon={<ShareAltOutlined />} className="border-gray-300">
            Chia sẻ
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl text-gray-600 space-y-2 text-sm">
          <p>🚚 Miễn phí vận chuyển cho đơn hàng trên 500.000 VND</p>
          <p>🔄 Đổi trả trong 30 ngày</p>
          <p>✅ Sản phẩm chính hãng 100%</p>
        </div>
      </div>
    </div>
  );
}
