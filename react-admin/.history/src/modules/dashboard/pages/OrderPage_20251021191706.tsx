import React, { useState } from "react";
import { Card, Radio, Input, Divider, Button } from "antd";
import {
  CreditCardOutlined,
  UserOutlined,
  FileTextOutlined,
  GiftOutlined,
} from "@ant-design/icons";

const OrderPage = () => {
  const [payment, setPayment] = useState("cash");
  const handlePaymentChange = (e: any) => setPayment(e.target.value);

  return (
    <div className="min-h-screen bg-green-50 p-6 font-sans">
      {/* Hai cột chính */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Chi tiết đơn hàng */}
        <Card
          title={
            <div className="flex items-center gap-2 text-green-800 font-bold">
              <FileTextOutlined /> Chi tiết đơn hàng
            </div>
          }
          className="rounded-2xl shadow-lg border-t-4 border-green-500"
        >
          <div className="space-y-4">
            <ServiceItem
              name="Massage toàn thân thư giãn"
              time="90 phút"
              price="450.000đ"
            />
            <ServiceItem
              name="Chăm sóc da mặt cơ bản"
              time="60 phút"
              price="280.000đ"
            />
            <ServiceItem name="Làm nail gel" time="45 phút" price="150.000đ" />

            <div className="text-gray-600 mt-4 space-y-1">
              <p>Tạm tính: 880.000đ</p>
              <p>Thuế VAT (10%): 88.000đ</p>
              <p>Giảm giá: -50.000đ</p>
            </div>

            <div className="bg-green-100 rounded-lg mt-3 p-3 flex justify-between font-bold text-green-800">
              <p>Tổng thanh toán:</p>
              <p>918.000đ</p>
            </div>
          </div>
        </Card>

        {/* Phương thức thanh toán */}
        <Card
          title={
            <div className="flex items-center gap-2 text-purple-700 font-bold">
              <CreditCardOutlined /> Phương thức thanh toán
            </div>
          }
          className="rounded-2xl shadow-lg border-t-4 border-purple-500"
        >
          <Radio.Group
            onChange={handlePaymentChange}
            value={payment}
            className="w-full space-y-3 flex flex-col"
          >
            <Radio value="cash">💵 Tiền mặt</Radio>
            <Radio value="credit">💳 Thẻ tín dụng / Ghi nợ</Radio>
            <Radio value="bank">🏦 Chuyển khoản ngân hàng</Radio>
            <Radio value="wallet">📱 Ví điện tử (MoMo, ZaloPay, ShopeePay)</Radio>
            <Radio value="qr">🔳 Thanh toán QR Code</Radio>
          </Radio.Group>

          <Divider />

          <label className="block text-gray-600 mb-1">Số tiền khách đưa:</label>
          <Input placeholder="Nhập số tiền..." type="number" className="mb-3" />

          <label className="block text-gray-600 mb-1">Ghi chú đặc biệt:</label>
          <Input.TextArea rows={3} placeholder="Nhập ghi chú cho đơn hàng..." />
        </Card>
      </div>

      {/* Thông tin khách hàng */}
      <Card
        title={
          <div className="flex items-center gap-2 text-green-800 font-bold">
            <UserOutlined /> Thông tin khách hàng
          </div>
        }
        className="rounded-2xl shadow-lg mt-6 border-t-4 border-green-500"
      >
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-500">Tên khách hàng</p>
            <p className="font-semibold">Nguyễn Thị Lan Anh</p>
          </div>
          <div>
            <p className="text-gray-500">Số điện thoại</p>
            <p className="font-semibold">0987 654 321</p>
          </div>
          <div>
            <p className="text-gray-500">Điểm tích lũy</p>
            <p className="font-semibold text-yellow-600">2.450 điểm</p>
          </div>
          <div>
            <p className="text-gray-500">Hạng thành viên</p>
            <p className="font-semibold text-purple-600">VIP Gold</p>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl border border-green-200 p-3 flex items-center gap-2 text-green-700">
          <GiftOutlined />
          <p>Ưu đãi áp dụng: Giảm giá 50.000đ - Khách hàng VIP</p>
        </div>
      </Card>

      {/* Nút hành động */}
      <div className="mt-6 flex flex-col md:flex-row gap-3 justify-between items-center">
        <Button
          type="primary"
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          ✅ Xác nhận thanh toán
        </Button>

        <div className="flex gap-3">
          <Button className="border border-gray-300">🧾 In hóa đơn</Button>
          <Button className="border border-gray-300">📧 Gửi hóa đơn</Button>
        </div>
      </div>
    </div>
  );
};

const ServiceItem = ({
  name,
  time,
  price,
}: {
  name: string;
  time: string;
  price: string;
}) => (
  <div className="flex justify-between items-start border-b pb-2">
    <div>
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">Thời gian: {time}</p>
    </div>
    <p className="text-green-700 font-semibold">{price}</p>
  </div>
);

export default OrderPage;
