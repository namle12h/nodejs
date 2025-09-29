'use client'
import { Tag } from "antd";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-20 bg-gray-170">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text bên trái */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Về <span className="text-pink-600">Bella Spa</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Với hơn 10 năm kinh nghiệm trong ngành làm đẹp, Bella Spa tự hào là địa chỉ tin cậy của hàng nghìn khách hàng. 
            Chúng tôi cam kết mang đến những trải nghiệm spa đẳng cấp với công nghệ hiện đại và đội ngũ chuyên gia giàu kinh nghiệm.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            Không gian spa được thiết kế theo phong cách hiện đại, sang trọng với hệ thống trang thiết bị cao cấp nhập khẩu từ Hàn Quốc và Nhật Bản, 
            đảm bảo an toàn tuyệt đối cho khách hàng.
          </p>

          {/* Số liệu */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-pink-600">10+</h3>
              <p className="text-gray-600">Năm Kinh Nghiệm</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-pink-600">50,000+</h3>
              <p className="text-gray-600">Khách Hàng Tin Tưởng</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-pink-600">20+</h3>
              <p className="text-gray-600">Dịch Vụ Chuyên Nghiệp</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-pink-600">98%</h3>
              <p className="text-gray-600">Khách Hàng Hài Lòng</p>
            </div>
          </div>

          {/* Badge */}
          <div className="flex flex-wrap gap-3">
            <Tag color="magenta" className="px-4 py-2 rounded-full text-base">
              🌸 Chứng Nhận ISO
            </Tag>
            <Tag color="red" className="px-4 py-2 rounded-full text-base">
              🏆 Top Spa 2024
            </Tag>
            <Tag color="purple" className="px-4 py-2 rounded-full text-base">
              🛡 An Toàn Tuyệt Đối
            </Tag>
          </div>
        </div>

        {/* Ảnh bên phải */}
        <div className="flex justify-center">
          <Image
            src="/upload/service5.jpg"
            alt="Bella Spa"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
