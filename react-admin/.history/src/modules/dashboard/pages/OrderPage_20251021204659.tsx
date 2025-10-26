import React, { useState } from "react";
import { Card, Radio, Input, Button } from "antd";
import {
    CreditCardOutlined,
    UserOutlined,
    FileTextOutlined,
    GiftOutlined,
} from "@ant-design/icons";

// =====================
// 1️⃣ Interface dữ liệu
// =====================
interface ServiceInfo {
    id: number;
    name: string;
    price: number;
    durationMin: number;
    description?: string;
    imageUrl?: string;
}

interface AppointmentRecord {
    id: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    status: string;
    notes?: string;
    startAt?: string;
    endAt?: string;
    serviceName: string;
    staffName?: string;
    roomName?: string;
    service: ServiceInfo; // ✅ object con chứa thông tin dịch vụ
}

// =====================
// 2️⃣ Component chính
// =====================
const OrderPage = ({ orderData }: { orderData: AppointmentRecord }) => {
    const [payment, setPayment] = useState("cash");
    const handlePaymentChange = (e: any) => setPayment(e.target.value);

    // 👉 Format thời gian (HH:mm)
    const formatTime = (iso?: string) =>
        iso
            ? new Date(iso).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            })
            : "";

    // 👉 Giá trị thanh toán
    const price = orderData?.service?.price || 0;
    const vat = price * 0.1;
    const discount = 50000;
    const total = price + vat - discount;

    return (
        <div className=" bg-green-50 p-6 font-sans">
            {/* Grid chính chia 2 cột */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* ========== CỘT TRÁI ========== */}
                <div className="flex flex-col gap-6">
                    {/* 🧾 Chi tiết đơn hàng */}
                    <Card
                        title={
                            <div className="flex items-center gap-2 text-white font-bold bg-gradient-to-r from-green-500 to-blue-500 px-3 py-2 rounded-t-lg">
                                <FileTextOutlined /> Chi tiết đơn hàng
                            </div>
                        }
                        className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                        bodyStyle={{ paddingTop: "1.5rem" }}
                    >
                        {/* Dịch vụ động */}
                        <ServiceItem
                            name={orderData.service?.name}
                            time={`${orderData.service?.durationMin} phút`}
                            price={`${orderData.service?.price.toLocaleString()}đ`}
                        />

                        <div className="text-gray-600 mt-4 space-y-1">
                            <p>Tạm tính: {price.toLocaleString()}đ</p>
                            <p>Thuế VAT (10%): {vat.toLocaleString()}đ</p>
                            <p>Giảm giá: -{discount.toLocaleString()}đ</p>
                        </div>

                        <div className="bg-green-100 rounded-lg mt-3 p-3 flex justify-between font-bold text-green-800">
                            <p>Tổng thanh toán:</p>
                            <p>{total.toLocaleString()}đ</p>
                        </div>
                    </Card>

                    {/* 👩‍🦰 Thông tin khách hàng */}
                    <Card
                        title={
                            <div className="flex items-center gap-2 text-white font-bold bg-gradient-to-r from-green-500 to-teal-400 px-3 py-2 rounded-t-lg">
                                <UserOutlined /> Thông tin khách hàng
                            </div>
                        }
                        className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                        bodyStyle={{ paddingTop: "1.5rem" }}
                    >
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <p className="text-gray-500 text-sm">Tên khách hàng</p>
                                <p className="font-semibold text-gray-800">
                                    {orderData.contactName}
                                </p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                <p className="text-gray-500 text-sm">Số điện thoại</p>
                                <p className="font-semibold text-gray-800">
                                    {orderData.contactPhone}
                                </p>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                <p className="text-gray-500 text-sm">Điểm tích lũy</p>
                                <p className="font-semibold text-yellow-800">2,450 điểm</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                <p className="text-gray-500 text-sm">Hạng thành viên</p>
                                <p className="font-semibold text-purple-700">VIP Gold</p>
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-xl border border-green-200 p-3 flex items-center gap-2 text-green-700 mt-2">
                            <GiftOutlined className="text-green-600" />
                            <p>
                                Ưu đãi áp dụng:{" "}
                                <span className="font-semibold">
                                    Giảm {discount.toLocaleString()}đ
                                </span>{" "}
                                - Khách hàng VIP
                            </p>
                        </div>
                    </Card>
                </div>

                {/* ========== CỘT PHẢI ========== */}
                <div className="flex flex-col gap-6">
                  {/* 💳 PHƯƠNG THỨC THANH TOÁN */}
        <Card
          title={
            <div className="flex items-center gap-2 text-white font-bold bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 rounded-t-lg">
              <CreditCardOutlined /> Phương thức thanh toán
            </div>
          }
          className="rounded-2xl shadow-md border border-gray-100 overflow-hidden"
          bodyStyle={{ paddingTop: "1.5rem" }}
        >
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition">
              <Radio
                value="cash"
                checked={payment === "cash"}
                onChange={handlePaymentChange}
              >
                💵 Tiền mặt
              </Radio>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition">
              <Radio
                value="credit"
                checked={payment === "credit"}
                onChange={handlePaymentChange}
              >
                💳 Thẻ tín dụng / Ghi nợ
              </Radio>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition">
              <Radio
                value="bank"
                checked={payment === "bank"}
                onChange={handlePaymentChange}
              >
                🏦 Chuyển khoản ngân hàng
              </Radio>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition">
              <Radio
                value="wallet"
                checked={payment === "wallet"}
                onChange={handlePaymentChange}
              >
                📱 Ví điện tử (MoMo, ZaloPay, ShopeePay)
              </Radio>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition">
              <Radio
                value="qr"
                checked={payment === "qr"}
                onChange={handlePaymentChange}
              >
                🔳 Thanh toán QR Code
              </Radio>
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-gray-600 mb-1">
              Số tiền khách đưa:
            </label>
            <Input
              placeholder="Nhập số tiền..."
              type="number"
              prefix="₫"
              className="shadow-sm"
            />
          </div>
        </Card>
      </div>


                    {/* 📝 Ghi chú đặc biệt */}
                    <Card
                        title={
                            <div className="flex items-center gap-2 text-gray-700 font-bold bg-gradient-to-r from-yellow-100 to-green-50 px-3 py-2 rounded-t-lg border-b border-gray-200">
                                📝 Ghi chú đặc biệt
                            </div>
                        }
                        className="rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                        bodyStyle={{ paddingTop: "1.2rem" }}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Nhập ghi chú cho đơn hàng..."
                            defaultValue={orderData?.notes || ""}
                            className="rounded-lg shadow-sm border-gray-200 focus:ring-2 focus:ring-green-400"
                        />
                    </Card>

                    {/* 🔘 Nút hành động */}
                    <div className="mt-3 flex flex-col md:flex-row gap-3 justify-between items-center">
                        <Button
                            type="primary"
                            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
                        >
                            ✅ Xác nhận thanh toán
                        </Button>

                        <div className="flex gap-3">
                            <Button className="border border-gray-300">🧾 In hóa đơn</Button>
                            <Button className="border border-gray-300">📧 Gửi hóa đơn</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =====================
// 3️⃣ Component con hiển thị dịch vụ
// =====================
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
