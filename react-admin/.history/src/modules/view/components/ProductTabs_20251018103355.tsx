import React from "react";
import { Tabs, Rate, Progress } from "antd";

export default function ProductTabs() {
  const items = [
    {
      key: "1",
      label: "Mô tả sản phẩm",
      children: (
        <div className="space-y-4 text-gray-700">
          <h3 className="font-semibold text-lg">
            Về Serum Vitamin C Skinceuticals CE Ferulic
          </h3>
          <p>
            Serum Vitamin C Skinceuticals CE Ferulic là một trong những sản phẩm chăm sóc da hàng đầu với công thức độc quyền chứa 15% L-Ascorbic Acid tinh khiết, kết hợp cùng 1% Vitamin E và 0.5% Ferulic Acid.
          </p>

          <h4 className="font-semibold">Công dụng chính:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Chống oxy hóa mạnh mẽ, bảo vệ da khỏi tác hại của gốc tự do</li>
            <li>Kích thích sản sinh collagen, giúp da săn chắc và đàn hồi</li>
            <li>Làm sáng da, mờ thâm nám và đều màu da</li>
            <li>Bảo vệ da khỏi tác hại của tia UV và ô nhiễm môi trường</li>
            <li>Cải thiện kết cấu da, làm mịn các nếp nhăn li ti</li>
          </ul>

          <h4 className="font-semibold">Phù hợp với:</h4>
          <p>Mọi loại da, đặc biệt hiệu quả cho da lão hóa, da xỉn màu, da có thâm nám và tàn nhang.</p>
        </div>
      ),
    },
    {
      key: "2",
      label: "Thành phần",
      children: (
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <div className="bg-pink-50 p-4 rounded-lg">
            <h4 className="text-pink-600 font-semibold">L-Ascorbic Acid (15%)</h4>
            <p>Vitamin C tinh khiết, chống oxy hóa và kích thích sản sinh collagen</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-pink-600 font-semibold">Vitamin E (1%)</h4>
            <p>Tăng cường khả năng chống oxy hóa và bảo vệ da</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg">
            <h4 className="text-pink-600 font-semibold">Ferulic Acid (0.5%)</h4>
            <p>Ổn định và tăng cường hiệu quả của Vitamin C và E</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-pink-600 font-semibold">Aqua, Propylene Glycol</h4>
            <p>Cung cấp độ ẩm và giúp thẩm thấu tốt hơn</p>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: "Hướng dẫn sử dụng",
      children: (
        <div className="space-y-6 text-gray-700">
          <h4 className="font-semibold text-lg">Cách sử dụng</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>Làm sạch da — rửa mặt sạch và lau khô nhẹ nhàng.</li>
            <li>Sử dụng serum — nhỏ 4-5 giọt lên lòng bàn tay, thoa đều lên mặt và cổ.</li>
            <li>Massage nhẹ nhàng để serum thẩm thấu.</li>
            <li>Sử dụng kem chống nắng (SPF 30+) khi ra ngoài vào buổi sáng.</li>
          </ol>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h5 className="font-semibold text-yellow-600 mb-2">Lưu ý quan trọng:</h5>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Sử dụng vào buổi sáng để đạt hiệu quả tối ưu.</li>
              <li>Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp.</li>
              <li>Ngưng sử dụng nếu có dấu hiệu kích ứng.</li>
              <li>Nên thử patch test trước khi sử dụng.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: "4",
      label: "Đánh giá khách hàng",
      children: (
        <div className="text-gray-700 space-y-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-pink-600 text-4xl font-bold">4.5</p>
              <Rate disabled defaultValue={4} />
              <p className="text-sm text-gray-500">89 đánh giá</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 text-gray-500">{star}★</span>
                  <Progress
                    percent={[80, 60, 20, 5, 0][i]}
                    showInfo={false}
                    strokeColor="#facc15"
                    className="flex-1"
                  />
                  <span className="text-gray-500 text-sm">
                    {[58, 22, 7, 2, 0][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y">
            {[
              {
                name: "Nguyễn Thị Lan",
                date: "15/09/2024",
                text: "Sản phẩm rất tốt, da mình sáng lên rõ rệt sau 2 tuần sử dụng. Texture nhẹ, thấm nhanh không gây bết dính.",
              },
              {
                name: "Trần Minh Anh",
                date: "08/09/2024",
                text: "Chất lượng ổn, mình thấy da đều màu hơn. Giá hơi cao nhưng xứng đáng với chất lượng.",
              },
              {
                name: "Lê Thị Hương",
                date: "02/09/2024",
                text: "Serum tuyệt vời! Da mịn màng, trắng sáng rõ rệt sau khi sử dụng 3 tuần.",
              },
            ].map((review, i) => (
              <div key={i} className="py-4">
                <p className="font-semibold">{review.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Rate disabled defaultValue={4} />
                  <span>{review.date}</span>
                </div>
                <p className="mt-1">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "5",
      label: "Chính sách đổi trả",
      children: (
        <div className="text-gray-700 space-y-6">
          <h4 className="font-semibold text-lg">Chính sách đổi trả sản phẩm</h4>

          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-semibold text-green-600 mb-2">Điều kiện đổi trả:</h5>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Sản phẩm còn nguyên seal, chưa sử dụng</li>
              <li>Trong thời hạn 30 ngày kể từ ngày mua</li>
              <li>Có hóa đơn mua hàng hoặc đơn hàng điện tử</li>
              <li>Sản phẩm không bị lỗi do người sử dụng</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-600 mb-2">Quy trình đổi trả:</h5>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Liên hệ hotline hoặc email hỗ trợ</li>
              <li>Cung cấp thông tin đơn hàng và lý do đổi trả</li>
              <li>Đóng gói sản phẩm theo hướng dẫn</li>
              <li>Gửi hàng về địa chỉ được cung cấp</li>
              <li>Nhận tiền hoàn lại trong 3-5 ngày làm việc</li>
            </ol>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
