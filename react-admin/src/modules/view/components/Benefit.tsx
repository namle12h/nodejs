import { CheckCircleFilled } from "@ant-design/icons";
import { useServiceSectionItems } from "../../../shared/services/serviceApi";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

export default function BenefitsAndResults() {
  const { id } = useParams<{ id: string }>();
  const { data: items, isLoading } = useServiceSectionItems(Number(id), "benefit");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  console.log("📦 API data =", items);

  if (!items || items.length === 0) {
    return (
      <p className="text-center text-gray-500 py-20 italic">
        🚫 Chưa có dữ liệu lợi ích.
      </p>
    );
  }

  // Lấy item đầu tiên có extraData (nếu nhiều thì render cái đầu)
  const firstItem = items.find((x: any) => x.extraData) || items[0];
  const extra = firstItem.extraData ? JSON.parse(firstItem.extraData) : null;

  const benefitList = extra?.items || [];
  const beforeImage = extra?.before;
  const afterImage = extra?.after;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Tiêu đề */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Lợi Ích & Kết Quả
          </h2>
          <p className="text-gray-600">
            Những lợi ích tuyệt vời mà bạn sẽ nhận được sau liệu trình chăm sóc da mặt
          </p>
        </div>

        {/* Lưới bố cục */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Danh sách lợi ích */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
            {benefitList.map((text: string, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircleFilled className="!text-pink-500 text-lg mt-1" />
                <p className="text-gray-700 leading-snug">{text}</p>
              </div>
            ))}
          </div>

          {/* Kết quả trước & sau */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-5 text-center md:text-left">
              Kết Quả Trước & Sau
            </h3>

            <div className="flex justify-center md:justify-start gap-6">
              <div className="text-center">
                <img
                  src={beforeImage || "https://placehold.co/200x250?text=Before"}
                  alt="Trước điều trị"
                  className="w-48 h-60 object-cover rounded-xl shadow-md mb-2"
                />
                <p className="text-gray-600 text-sm">Trước Điều Trị</p>
              </div>
              <div className="text-center">
                <img
                  src={afterImage || "https://placehold.co/200x250?text=After"}
                  alt="Sau điều trị"
                  className="w-48 h-60 object-cover rounded-xl shadow-md mb-2"
                />
                <p className="text-pink-600 font-medium text-sm">Sau Điều Trị</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
