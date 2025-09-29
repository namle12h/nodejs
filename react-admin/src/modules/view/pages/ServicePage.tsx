import { Card, Button, Spin } from "antd";
import { axiosClient } from "../../../shared/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export default function FeaturedServices() {

  // query params cho phân trang
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const fetchServices = async ({ queryKey }: any) => {
    const [_key, page = 1, limit = 5] = queryKey;
    const response = await axiosClient.get(`/services`, {
      params: { page, limit },
    });

    console.log("<<==>> raw services", response.data);

    // nếu backend trả mảng trực tiếp
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // nếu backend bọc trong { data: [...] }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    return [];
  };

  const KEYs = {
    getServices: () => ["services", page, limit] as const,
  };

  const queryServices = useQuery({
    queryKey: KEYs.getServices(),
    queryFn: fetchServices,
  });

  // loading state
  if (queryServices.isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  // error state
  if (queryServices.isError) {
    return (
      <div className="text-center text-red-500 py-20">
        Lỗi tải dịch vụ. Vui lòng thử lại.
      </div>
    );
  }
  console.log("Query result", queryServices.data, queryServices.isLoading, queryServices.error);

  return (
    <section className="py-16 bg-gray-50 ">
      <div className="container mx-auto px-4 max-w-[1200px]">
        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Dịch Vụ Nổi Bật
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Khám phá các liệu trình spa chuyên nghiệp được thiết kế để mang lại
            sự thư giãn tối đa và làm đẹp hoàn hảo
          </p>
        </div>

        {/* Grid dịch vụ */}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {queryServices.data.map((s: any) => (
            <Card
              key={s.id}
              hoverable
              cover={
                <img
                  alt={s.name}
                  src={s.imageUrl || "/upload/service1.jpg"}
                  className="h-56 w-full object-cover"
                />
              }
              className="shadow-md rounded-xl overflow-hidden"
              bodyStyle={{ padding: "16px" }} // bớt padding default của antd
            >
              {/* Tên dịch vụ */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {s.name}
              </h3>

              {/* Mô tả */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {s.description}
              </p>

              {/* Giá + nút CTA */}
              <div className="flex items-center justify-between">
                <span className="text-pink-600 font-bold text-lg">
                  {s.price.toLocaleString()} VNĐ
                </span>
                <Button type="primary" className="!bg-pink-600">
                  Xem Chi Tiết
                </Button>
              </div>
            </Card>
          ))}
        </div>


      </div>
    </section>
  );
}
