
import { Card, Spin } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { useServiceProducts } from "../../../shared/services/productApi";

interface UsedProductsProps {
  serviceId: number;
}

export default function UsedProducts({ serviceId }: UsedProductsProps) {
  const { data: serviceProducts, isLoading } = useServiceProducts(serviceId);

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );

  if (!serviceProducts || serviceProducts.length === 0)
    return (
      <div className="text-center text-gray-500 py-16">
        Chưa có sản phẩm nào được sử dụng cho dịch vụ này.
      </div>
    );

  // Map dữ liệu từ API ra đúng cấu trúc hiển thị
  const products =
    serviceProducts.map((sp: any) => ({
      id: sp.id,
      name: sp.productName,
      desc: sp.note || "Không có mô tả",
      image: sp.imageUrl, // ✅ dùng đúng field từ API
    })) || [];


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
          {products.map((p: any) => (
            <Card
              key={p.id}
              hoverable
              cover={
                <img
                  alt={p.name}
                  src={p.image}
                  className="w-full h-56 object-cover rounded-t-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              }
              className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              styles={{ body:{padding: "16px" }}}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                {p.name}
              </h3>
              <p className="text-gray-600 text-sm text-center line-clamp-2">
                {p.desc}
              </p>
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
