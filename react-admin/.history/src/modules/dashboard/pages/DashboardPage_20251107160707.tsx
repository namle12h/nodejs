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
  return (
    <div>
      <Title>Dashboard | My Website</Title>
      {/* <Link rel="icon" href="/favicon-home.png" /> */}
    </div>

  )
}


