import {
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

export default function ServiceStats() {
  const data = [
    { name: "Massage Thư Giãn", value: 892, percent: "24.1%", color: "#ec4899", money: "445M VND" },
    { name: "Chăm Sóc Da Mặt", value: 756, percent: "20.4%", color: "#a855f7", money: "378M VND" },
    { name: "Tắm Trắng Toàn Thân", value: 634, percent: "17.1%", color: "#3b82f6", money: "317M VND" },
    { name: "Nail Art & Spa", value: 523, percent: "14.1%", color: "#22c55e", money: "262M VND" },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold">Thống Kê Dịch Vụ</h3>
          <p className="text-gray-500 text-sm">Phân tích hiệu suất các dịch vụ spa</p>
        </div>
        <button className="text-pink-600 text-sm font-semibold hover:underline">Xem chi tiết</button>
      </div>

      {/* Donut chart */}
      <div className="h-48 relative flex justify-center items-center">
        <ResponsiveContainer width="60%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={45}
              outerRadius={70}
              
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="none"       strokeWidth={0} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Middle text */}
        <div className="absolute text-center">
          <h3 className="text-2xl font-bold">{total}</h3>
          <p className="text-gray-500 text-sm">Tổng lịch hẹn</p>
        </div>
      </div>

      {/* List */}
      <div className="mt-3 space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: item.color }}></span>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-500 text-sm">{item.value} lượt đặt</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">{item.percent}</p>
              <p className="text-gray-500 text-sm">{item.money}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
