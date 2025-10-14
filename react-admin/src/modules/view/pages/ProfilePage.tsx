import Footer from "../../../shared/components/Footer";
import Header from "../../../shared/components/Header";
import Sidebar from "../components/SideBar";
import { Outlet } from "react-router-dom";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex flex-1 justify-center py-20">
        <div className="flex bg-white rounded-2xl shadow-sm w-[90%] max-w-6xl overflow-hidden">
          {/* Sidebar */}
          <aside className="w-72 bg-white p-10 ">
            <Sidebar />
          </aside>

          {/* Nội dung hiển thị */}
          <section className="flex-1 p-10">
            <Outlet />
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
