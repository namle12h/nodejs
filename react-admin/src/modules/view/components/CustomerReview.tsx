import { Card, Rate, Form, Input, Button } from "antd";
import { StarFilled } from "@ant-design/icons";
import { useState } from "react";

export default function CustomerReviews() {
  const [form] = Form.useForm();
  const [reviews, setReviews] = useState([
    {
      name: "Nguyễn Thị Hương",
      date: "15/01/2024",
      rating: 5,
      text: "Liệu trình chăm sóc da mặt tại đây thực sự tuyệt vời! Da tôi trở nên mịn màng và sáng khỏe hơn rất nhiều. Nhân viên rất chuyên nghiệp và tận tình.",
      avatar:
        "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1759822501/spring_customers/woman1.jpg",
    },
    {
      name: "Trần Minh Châu",
      date: "12/01/2024",
      rating: 5,
      text: "Tôi đã thử nhiều spa khác nhưng chỉ có ở đây mới cho kết quả thực sự ấn tượng. Quy trình rất chi tiết và sản phẩm chất lượng cao.",
      avatar:
        "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1759822602/spring_customers/woman2.jpg",
    },
    {
      name: "Lê Thị Lan Anh",
      date: "08/01/2024",
      rating: 5,
      text: "Không gian spa rất thư giãn và sạch sẽ. Liệu trình chăm sóc da giúp tôi cảm thấy tự tin hơn nhiều. Chắc chắn sẽ quay lại thường xuyên.",
      avatar:
        "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1759822703/spring_customers/woman3.jpg",
    },
  ]);

  const onFinish = (values: any) => {
    const newReview = {
      name: values.name,
      date: new Date().toLocaleDateString("vi-VN"),
      rating: values.rating,
      text: values.text,
      avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
    };
    setReviews([newReview, ...reviews]);
    form.resetFields();
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Tiêu đề */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Đánh Giá Khách Hàng
          </h2>
          <p className="text-gray-600">
            Những chia sẻ chân thực từ khách hàng đã trải nghiệm dịch vụ
          </p>
        </div>

        {/* Danh sách đánh giá */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {reviews.map((r, i) => (
            <Card
              key={i}
              className="bg-pink-50 rounded-2xl shadow-sm p-5 border-0"
              bodyStyle={{ padding: "1.5rem" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{r.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Rate disabled defaultValue={r.rating} className="text-yellow-400" />
                    <span>{r.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">"{r.text}"</p>
            </Card>
          ))}
        </div>

        {/* Tổng kết đánh giá */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-8 rounded-2xl shadow-md mb-16">
          <div className="flex justify-center items-center gap-2 mb-2">
            <StarFilled className="text-yellow-300 text-2xl" />
            <span className="text-3xl font-bold">4.9</span>
            <span className="text-lg">/5</span>
          </div>
          <p className="text-lg font-medium">
            Đánh giá trung bình từ 248 khách hàng
          </p>
          <p className="text-sm opacity-90 mt-1">
            98% khách hàng hài lòng và quay lại sử dụng dịch vụ
          </p>
        </div>

        {/* Form đánh giá */}
        <div className="max-w-2xl mx-auto bg-pink-50 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Gửi Đánh Giá Của Bạn
          </h3>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên của bạn" }]}
            >
              <Input placeholder="Nhập họ và tên của bạn" />
            </Form.Item>

            <Form.Item
              label="Đánh giá"
              name="rating"
              rules={[{ required: true, message: "Vui lòng chọn số sao đánh giá" }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item
              label="Nhận xét"
              name="text"
              rules={[{ required: true, message: "Vui lòng nhập nội dung đánh giá" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn..."
              />
            </Form.Item>

            <Form.Item className="text-center mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-pink-600 hover:bg-pink-700 rounded-xl px-8 py-5 text-lg font-semibold"
              >
                Gửi Đánh Giá
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
}
