import { useEffect, useState } from "react";

interface OrderItemProps {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export default function OrderItem({ name, quantity, price, image }: OrderItemProps) {
  const [formattedPrice, setFormattedPrice] = useState("");

  useEffect(() => {
    // ✅ Định dạng giá tiền theo chuẩn Việt Nam
    setFormattedPrice(price.toLocaleString("vi-VN"));
  }, [price]);

  return (
    <div className="flex items-center py-4 border-b">
      {/* Ảnh sản phẩm */}
      <div className="w-16 h-16 flex-shrink-0 relative">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover object-top rounded-md"
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="ml-4 flex-grow">
        <h3 className="font-medium text-gray-800">{name}</h3>
        <p className="text-gray-500">SL: {quantity}</p>
      </div>

      {/* Giá */}
      <div className="text-right">
        <p className="font-medium text-gray-700">{formattedPrice} VND</p>
      </div>
    </div>
  );
}
