import { useEffect, useState } from "react";
import { Table, Button, InputNumber, message, Empty, Card } from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);

  // 🧩 Load giỏ hàng khi vào trang
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // 🧮 Tính tổng tiền
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🧹 Xóa 1 sản phẩm
  const handleRemove = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    message.info("Đã xóa sản phẩm khỏi giỏ 🗑️");
  };

  // 🔢 Cập nhật số lượng
  const handleQuantityChange = (id: number, value: number) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: value } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // 🛒 Tiến hành thanh toán
  const handleCheckout = () => {
    message.success("Chuyển đến trang thanh toán 💳");
    navigate("/checkout");
  };

  // 💡 Cấu hình cột bảng
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <img
            src={record.imageUrl || "/upload/product-default.jpg"}
            alt={record.name}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <p className="font-medium text-gray-800">{text}</p>
            <p className="text-gray-500 text-sm">
              {record.price.toLocaleString()} ₫
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      render: (value: number, record: any) => (
        <InputNumber
          min={1}
          value={value}
          onChange={(v) => handleQuantityChange(record.id, v || 1)}
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      align: "right" as const,
      render: (_, record:any) => (
        <b>{(record.price * record.quantity).toLocaleString()} ₫</b>
      ),
    },
    {
      title: "",
      key: "action",
      align: "center" as const,
      render: (_, record:any) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemove(record.id)}
        />
      ),
    },
  ];

  if (cart.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Empty
          description="Giỏ hàng của bạn đang trống"
          imageStyle={{ height: 120 }}
        />
        <Button
          type="primary"
          className="mt-4 bg-pink-600 hover:bg-pink-700"
          onClick={() => navigate("/products")}
        >
          Tiếp tục mua sắm
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto py-10 px-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCartOutlined /> Giỏ hàng của bạn
      </h2>

      <Card className="shadow-md rounded-xl">
        <Table
          columns={columns}
          dataSource={cart}
          rowKey="id"
          pagination={false}
        />

        <div className="flex justify-end mt-6 text-right">
          <div>
            <p className="text-gray-600 mb-2">
              Tổng cộng:{" "}
              <span className="text-xl font-semibold text-pink-600">
                {totalPrice.toLocaleString()} ₫
              </span>
            </p>
            <Button
              type="primary"
              size="large"
              className="bg-pink-600 hover:bg-pink-700"
              onClick={handleCheckout}
            >
              Tiến hành thanh toán
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
