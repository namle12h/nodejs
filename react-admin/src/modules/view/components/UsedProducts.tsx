import { Card } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";

export default function UsedProducts() {
  const products = [
    {
      id: 1,
      name: "Sữa Rửa Mặt La Roche-Posay",
      desc: "Sản phẩm nhập khẩu từ Pháp, dành cho da nhạy cảm",
      image:
        "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1759822001/spring_products/la_roche_posay.jpg",
    },
    {
      id: 2,
      name: "Serum Vitamin C Skinceuticals",
      desc: "Serum chống oxy hóa cao cấp từ Mỹ",
      image:
        "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1759822102/spring_products/skinceuticals_vitc.jpg",
    },
    {
      id: 3,
      name: "Mặt Nạ Collagen Nhật Bản",
      desc: "Mặt nạ sinh học từ Nhật Bản, giàu collagen",
      image:
        "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1759822203/spring_products/japan_collagen.jpg",
    },
    {
      id: 4,
      name: "Kem Dưỡng Ẩm Cetaphil",
      desc: "Kem dưỡng ẩm an toàn cho mọi loại da",
      image:
        "https://res.cloudinary.com/dtxcwdf7r/image/upload/v1759822304/spring_products/cetaphil_cream.jpg",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Tiêu đề */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Sản Phẩm Sử Dụng
          </h2>
          <p className="text-gray-600">
            Chúng tôi chỉ sử dụng các sản phẩm chăm sóc da cao cấp từ những
            thương hiệu uy tín thế giới
          </p>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((p) => (
            <Card
              key={p.id}
              hoverable
              cover={
                <img
                  alt={p.name}
                  src={p.image}
                  className="w-full h-56 object-contain p-4"
                />
              }
              className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              bodyStyle={{ padding: "16px" }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                {p.name}
              </h3>
              <p className="text-gray-600 text-sm text-center">{p.desc}</p>
            </Card>
          ))}
        </div>

        {/* Cam kết an toàn */}
        <div className="mt-16 bg-green-50 rounded-2xl py-8 px-6 text-center shadow-sm">
          <div className="flex justify-center items-center gap-2 mb-3">
            <SafetyCertificateOutlined className="text-green-600 text-2xl" />
            <h3 className="text-xl font-bold text-gray-800">Cam Kết An Toàn</h3>
          </div>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Tất cả sản phẩm đều được kiểm định chất lượng, có nguồn gốc xuất xứ
            rõ ràng và được FDA, CE chứng nhận an toàn cho da. Chúng tôi cam kết
            không sử dụng các chất có hại như paraben, sulfate hay hóa chất độc
            hại.
          </p>
        </div>
      </div>
    </section>
  );
}
