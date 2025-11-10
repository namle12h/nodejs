import { Title, Link } from "react-head";

export default function DashboardPage() {

  const revenueData = [
    { name: "T1", actual: 200, target: 180 },
    { name: "T2", actual: 230, target: 200 },
    { name: "T3", actual: 250, target: 240 },
    { name: "T4", actual: 300, target: 280 },
    { name: "T5", actual: 320, target: 300 },
    { name: "T6", actual: 350, target: 320 },
    { name: "T7", actual: 370, target: 350 },
    { name: "T8", actual: 390, target: 360 },
    { name: "T9", actual: 410, target: 380 },
    { name: "T10", actual: 430, target: 400 },
    { name: "T11", actual: 450, target: 420 },
    { name: "T12", actual: 480, target: 450 },
  ];

  const serviceData = [
    { name: "Massage Thư Giãn", value: 892, color: "#EC4899" },
    { name: "Chăm Sóc Da Mặt", value: 756, color: "#A855F7" },
    { name: "Tắm Trắng", value: 533, color: "#F97316" },
    { name: "Gội Đầu Dưỡng Sinh", value: 459, color: "#0EA5E9" },
  ];

   const total = serviceData.reduce((a, b) => a + b.value, 0);
 return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-3">Thống Kê Spa</h1>
      <p className="text-gray-500 mb-5">Tổng quan hiệu suất và doanh thu</p>

      {/* FILTER + BUTTONS */}
      <div className="flex justify-end mb-6 gap-3">
        <select className="border rounded px-3 py-2">
          <option>30 ngày qua</option>
          <option>7 ngày qua</option>
          <option>Theo tháng</option>
        </select>
        <button className="px-4 py-2 bg-pink-500 text-white rounded-lg">
          Xuất báo cáo
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          { title: "Tổng doanh thu", value: "2,450,000,000 VND", percent: "+12.5%" },
          { title: "Khách hàng mới", value: "1,247 người", percent: "+8.2%" },
          { title: "Lịch hẹn hoàn thành", value: "3,892 lịch", percent: "+15.3%" },
          { title: "Tỷ lệ hài lòng", value: "96.8 %", percent: "+2.1%" },
          { title: "Dịch vụ phổ biến", value: "892 lượt", percent: "+5.7%" },
          { title: "Thời gian chờ TB", value: "12 phút", percent: "-3.2%" },
        ].map((card, i) => (
          <div key={i} className="bg-white shadow-md rounded-xl p-4">
            <p className="text-gray-500 text-sm">{card.title}</p>
            <h2 className="font-bold text-xl">{card.value}</h2>
            <p className="text-green-600 text-sm font-semibold">{card.percent}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR CHART */}
        <div className="bg-white shadow-md rounded-xl p-5">
          <h3 className="font-semibold mb-3">Biểu Đồ Doanh Thu</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="actual" name="Thực tế" />
              <Bar dataKey="target" name="Mục tiêu" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white shadow-md rounded-xl p-5">
          <h3 className="font-semibold mb-3">Thống Kê Dịch Vụ</h3>
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie
                data={serviceData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {serviceData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center font-bold mt-2">
            {total} Tổng lượt đặt
          </p>
        </div>
      </div>
    </div>
  );
}


