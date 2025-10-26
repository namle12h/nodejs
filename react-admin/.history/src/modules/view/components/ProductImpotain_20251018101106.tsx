import { Card, Rate } from "antd";

const products = [
  {
    id: 1,
    name: "Sữa Rửa Mặt La Roche-Posay Toleriane",
    price: "850.000 VND",
    image: "https://via.placeholder.com/100", // thay bằng ảnh thật
    rating: 4,
  },
  {
    id: 2,
    name: "Serum Vitamin C Skinceuticals CE Ferulic",
    price: "2.450.000 VND",
    image: "https://via.placeholder.com/100",
    rating: 5,
  },
  {
    id: 3,
    name: "Mặt Nạ Collagen Nhật Bản Premium",
    price: "120.000 VND",
    image: "https://via.placeholder.com/100",
    rating: 4,
  },
  {
    id: 4,
    name: "Kem Dưỡng Ẩm Cetaphil Daily Moisturizer",
    price: "450.000 VND",
    image: "https://via.placeholder.com/100",
    rating: 4,
  },
];

export default function FeaturedProducts() {
  return (
    <div className="bg-pink-600 opacity-60 py-12 text-center">
      <h2 className="text-white text-3xl font-bold mb-2">Sản Phẩm Nổi Bật</h2>
      <p className="text-pink-100 mb-8">
        Những sản phẩm được yêu thích nhất tại Bella Spa
      </p>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {products.map((item) => (
          <Card
            key={item.id}
            className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-contain rounded-full"
              />
              <h3 className="font-semibold text-gray-800">
                {item.name}
              </h3>
              <Rate disabled defaultValue={item.rating} />
              <p className="text-pink-600 font-bold text-lg">{item.price}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
