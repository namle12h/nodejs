import { Button, InputNumber, Table, message } from "antd";
import { useCart } from "../../../shared/hooks/useCart";
import Header from "../../../shared/components/Header";
import Footer from "../../../shared/components/Footer";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();

  const handleCheckout = () => {
    message.success("Thanh toán thành công (giả lập)!");
    clearCart();
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <img src={record.imageUrl} alt={text} className="w-16 h-16 object-cover rounded" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (p: number) => `${p.toLocaleString()} VND`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (q: number, record: any) => (
        <InputNumber
          min={1}
          value={q}
          onChange={(val) => updateQuantity(record.id, Number(val))}
        />
      ),
    },
    {
      title: "Tổng",
      render: (_: any, record: any) =>
        `${(record.price * record.quantity).toLocaleString()} VND`,
    },
    {
      title: "Hành động",
      render: (_: any, record: any) => (
        <Button danger onClick={() => removeFromCart(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Header />

      <div className="container mx-auto px-4 py-10 max-w-[1000px]">
        <h2 className="text-2xl font-bold mb-6">🛒 Giỏ hàng của bạn</h2>

        <Table
          columns={columns}
          dataSource={cart}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: "Chưa có sản phẩm nào trong giỏ" }}
        />

        {cart.length > 0 && (
          <div className="flex justify-between items-center mt-8">
            <h3 className="text-xl font-semibold">
              Tổng cộng:{" "}
              <span className="text-pink-600">{totalPrice.toLocaleString()} VND</span>
            </h3>
            <div className="flex gap-3">
              <Button danger onClick={clearCart}>
                Xóa toàn bộ
              </Button>
              <Button type="primary" className="!bg-pink-600" onClick={handleCheckout}>
                Thanh toán
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
