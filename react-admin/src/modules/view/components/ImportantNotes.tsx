import {
  ClockCircleFilled,
  HeartFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
  SmileFilled,
} from "@ant-design/icons";

export default function ImportantNotes() {
  const notes = [
    {
      id: 1,
      title: "Trước Liệu Trình",
      icon: <ClockCircleFilled className="!text-blue-500 text-3xl" />,
      color: "blue",
      tips: [
        "Tẩy trang và rửa mặt sạch trước khi đến",
        "Không sử dụng retinol 3 ngày trước",
        "Thông báo tình trạng da và dị ứng (nếu có)",
        "Đến đúng giờ hẹn để có thời gian thư giãn",
      ],
    },
    {
      id: 2,
      title: "Trong Quá Trình",
      icon: <SmileFilled className="!text-green-500 text-3xl" />,
      color: "green",
      tips: [
        "Thư giãn hoàn toàn và tận hưởng liệu trình",
        "Thông báo ngay nếu cảm thấy khó chịu",
        "Tắt điện thoại để có trải nghiệm tốt nhất",
        "Uống nước đầy đủ khi được nhân viên đưa",
      ],
    },
    {
      id: 3,
      title: "Sau Liệu Trình",
      icon: <HeartFilled className="!text-pink-500 text-3xl" />,
      color: "pink",
      tips: [
        "Không trang điểm trong 4-6 giờ đầu",
        "Sử dụng kem chống nắng SPF 30+ khi ra ngoài",
        "Uống nhiều nước để duy trì độ ẩm cho da",
        "Theo dõi da và liên hệ nếu có bất thường",
      ],
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
          <p className="text-gray-600">
            Những điều cần biết để có trải nghiệm tốt nhất và đạt hiệu quả cao
            nhất
          </p>
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

              <ul className="text-left space-y-2">
                {n.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircleFilled
                      className={`!text-${n.color}-500 text-base mt-1`}
                    />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
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
