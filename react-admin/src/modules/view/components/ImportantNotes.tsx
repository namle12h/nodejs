import {
  ClockCircleFilled,
  HeartFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
  SmileFilled,
} from "@ant-design/icons";
import { useServiceSectionItems } from "../../../shared/services/serviceApi";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

export default function ImportantNotes() {
  const { id } = useParams<{ id: string }>();
  const { data: items, isLoading } = useServiceSectionItems(Number(id), "note");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <p className="text-center text-gray-500 py-20 italic">
        🚫 Chưa có dữ liệu lưu ý quan trọng.
      </p>
    );
  }

  // 🧩 Lấy item đầu tiên có extraData
  const firstItem = items.find((x: any) => x.extraData) || items[0];
  const extra = firstItem.extraData ? JSON.parse(firstItem.extraData) : null;

  const beforeList = extra?.before || [];
  const duringList = extra?.during || [];
  const afterList = extra?.after || [];

  const notes = [
    {
      id: 1,
      title: "Trước Liệu Trình",
      icon: <ClockCircleFilled className="!text-blue-500 text-3xl" />,
      color: "blue",
      tips: beforeList,
    },
    {
      id: 2,
      title: "Trong Quá Trình",
      icon: <SmileFilled className="!text-green-500 text-3xl" />,
      color: "green",
      tips: duringList,
    },
    {
      id: 3,
      title: "Sau Liệu Trình",
      icon: <HeartFilled className="!text-pink-500 text-3xl" />,
      color: "pink",
      tips: afterList,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Tiêu đề */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Lưu Ý Quan Trọng
          </h2>
          <p className="text-gray-600">{firstItem.description}</p>
        </div>

        {/* Card lưu ý */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {notes.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8 text-center"
            >
              <div className="flex justify-center mb-5">
                <div
                  className={`w-14 h-14 rounded-full bg-${n.color}-50 flex items-center justify-center`}
                >
                  {n.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-5">
                {n.title}
              </h3>

              {n.tips.length > 0 ? (
                <ul className="text-left space-y-2">
                  {n.tips.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircleFilled
                        className={`!text-${n.color}-500 text-base mt-1`}
                      />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic">Chưa có lưu ý nào</p>
              )}
            </div>
          ))}
        </div>

        {/* Lưu ý đặc biệt */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-5 flex gap-3 items-start shadow-sm">
          <ExclamationCircleFilled className="!text-yellow-500 text-2xl mt-1" />
          <div>
            <h4 className="font-semibold text-yellow-700 mb-1">
              Lưu Ý Đặc Biệt
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Liệu trình không phù hợp với phụ nữ mang thai, đang cho con bú, có
              vết thương hở trên mặt hoặc đang trong giai đoạn điều trị da liễu
              nghiêm trọng. Vui lòng tư vấn với bác sĩ trước khi thực hiện.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
