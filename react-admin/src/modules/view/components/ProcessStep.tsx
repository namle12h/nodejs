import { Card, Spin, Tag } from "antd";
import { useServiceSectionItems } from "../../../shared/services/serviceApi";
import { useParams } from "react-router-dom";

export default function ProcessSteps() {
  const { id } = useParams<{ id: string }>();
  const { data: steps, isLoading } = useServiceSectionItems(Number(id), "step");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  console.log("📦 API data =", steps);

  if (!steps || steps.length === 0) {
    return (
      <p className="text-center text-gray-500 py-20 italic">
        🚫 Chưa có quy trình nào được thêm cho dịch vụ này.
      </p>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Tiêu đề */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Quy Trình Thực Hiện
          </h2>
          <p className="text-gray-600">
            {steps.length} bước chăm sóc da mặt chuyên nghiệp được thực hiện
            bởi đội ngũ chuyên gia giàu kinh nghiệm
          </p>
        </div>

        {/* Danh sách bước */}
        <div className="flex flex-col gap-20">
          {steps.map((step: any, index: number) => (
            <div
              key={step.id} // ✅ id duy nhất
              className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
            >
              {/* Ảnh minh họa */}
              <Card
                cover={
                  <img
                    src={step.imageUrl}
                    alt={step.title}
                    className="rounded-xl h-[300px] w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                    }}
                  />
                }
                className="flex-1 rounded-2xl shadow-md overflow-hidden"
                styles={{ body: { display: "none" } }}
              />

              {/* Nội dung */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-pink-600 text-white font-bold text-lg w-10 h-10 flex items-center justify-center rounded-full">
                    {index + 1}
                  </div>
                  <Tag color="pink" className="text-sm px-3 py-1 rounded-full">
                    {step.times ? `${step.times} phút` : "15 phút"}
                  </Tag>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description || "Chưa có mô tả chi tiết cho bước này."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
