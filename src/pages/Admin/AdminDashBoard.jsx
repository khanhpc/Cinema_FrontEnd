import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMoviePage from "./AdminMoviePage";
import AdminShowtimePage from "./AdminShowtimePage";
import AdminCinemaPage from "./AdminCinemaPage";
import AdminRoomPage from "./AdminRoomPage";
import AdminComboBongNuoc from "./AdminComboBongNuoc";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("movies");
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Xác nhận đăng xuất",
      text: "Bác muốn nghỉ ngơi một chút à?",
      icon: "question",
      background: "#1e1e2e",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Ở lại",
      customClass: {
        popup:
          "rounded-[30px] border border-white/10 shadow-2xl backdrop-blur-xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    });
  };

  const menuItems = [
    {
      id: "movies",
      label: "Kho Phim",
      icon: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z",
    },
    {
      id: "showtimes",
      label: "Suất Chiếu",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      id: "cinemas",
      label: "Quản Lý Rạp",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      id: "rooms",
      label: "Phòng Chiếu",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      id: "combo-bongnuoc",
      label: "Bắp & Nước",
      icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      id: "statistics",
      label: "Thống Kê",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v16a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
  ];

  return (
    <div className="flex h-screen bg-[#0f111a] text-slate-200 overflow-hidden font-sans">
      {/* ================== SIDEBAR (MÀU XANH ĐÊM SANG TRỌNG) ================== */}
      <aside className="w-80 bg-[#161925] border-r border-white/5 flex flex-col relative z-30 shadow-2xl">
        {/* Logo Section */}
        <div className="h-28 flex items-center px-10 border-b border-white/5">
          <div
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-gradient-to-br from-rose-500 to-fuchsia-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(244,63,94,0.4)] group-hover:scale-110 transition-transform">
              C+
            </div>
            <div>
              <h1 className="text-white font-black text-xl leading-none tracking-tighter">
                CINEMA PLUS
              </h1>
              <p className="text-[10px] text-rose-500 font-black tracking-[0.4em] uppercase mt-1.5 opacity-80">
                Hệ thống quản trị
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-6 py-10 space-y-3 overflow-y-auto custom-scroll">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 group ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-xl shadow-rose-500/20 scale-[1.03]"
                  : "text-slate-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                className={`w-6 h-6 transition-transform group-hover:rotate-6 ${activeTab === item.id ? "text-white" : "text-slate-600"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={item.icon}
                />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer Sidebar (User Info) */}
        <div className="p-8 border-t border-white/5 bg-black/10">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-[25px] border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=Admin&background=f43f5e&color=fff`}
                  alt="Admin"
                  className="w-10 h-10 rounded-xl border border-white/10"
                />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#161925] rounded-full"></span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white uppercase truncate">
                  KhanhDTK Admin
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">
                  Chủ rạp
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all active:scale-90"
              title="Thoát hệ thống"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ================== MAIN CONTENT (KHÔNG CÒN ĐEN XÌ) ================== */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Nền trang trí (Làm mờ nghệ thuật) */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-rose-600/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Header trên cùng */}
        <header className="h-28 bg-[#0f111a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-14 relative z-20">
          <div>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-2 opacity-80">
              Bác đang quản lý mục
            </p>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
              {menuItems.find((i) => i.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end mr-4">
              <span className="text-xs font-black text-slate-400 uppercase">
                Hôm nay
              </span>
              <span className="text-sm font-bold text-white">
                {new Date().toLocaleDateString("vi-VN")}
              </span>
            </div>
            <button className="relative p-4 bg-white/5 text-slate-400 hover:text-white rounded-2xl border border-white/5 transition-all hover:border-rose-500/50 group">
              <svg
                className="w-6 h-6 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0f111a]"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-12 custom-scroll relative z-10 bg-gradient-to-b from-transparent to-black/20">
          <div className="max-w-[1600px] mx-auto animate-pageIn">
            {activeTab === "movies" && <AdminMoviePage />}
            {activeTab === "showtimes" && <AdminShowtimePage />}
            {activeTab === "cinemas" && <AdminCinemaPage />}
            {activeTab === "rooms" && <AdminRoomPage />}
            {activeTab === "combo-bongnuoc" && <AdminComboBongNuoc />}
            {activeTab === "statistics" && (
              <div className="h-[60vh] flex flex-col items-center justify-center bg-white/5 rounded-[40px] border border-white/5 border-dashed">
                <div className="text-8xl mb-6">📊</div>
                <h3 className="text-2xl font-black text-white uppercase tracking-widest">
                  Báo cáo doanh thu
                </h3>
                <p className="text-slate-500 font-bold mt-2">
                  Đang xử lý dữ liệu từ các rạp, bác đợi cháu chút nhé!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #f43f5e; }
        
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-pageIn { animation: pageIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
}
