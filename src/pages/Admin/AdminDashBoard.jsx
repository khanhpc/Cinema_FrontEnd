import React, { useState } from "react";
import AdminMoviePage from "./AdminMoviePage";
import AdminShowtimePage from "./AdminShowtimePage";
import { useNavigate } from "react-router-dom";
import AdminCinemaPage from "./AdminCinemaPage";
import AdminRoomPage from "./AdminRoomPage";
import AdminComboBongNuoc from "./AdminComboBongNuoc";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("movies");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* ================== SIDEBAR (Menu Trái) ================== */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
        <a className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950" href="/">
          <span className="text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
            🍿{" "}
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400"
              style={{
                color: "#e50914",
                fontSize: "24px",
                fontWeight: "900",
                letterSpacing: "2px",
              }}
            >
              Cinema
            </span>{" "}
            Admin
          </span>
        </a>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Nút: Quản lý Phim */}
          <button
            onClick={() => setActiveTab("movies")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "movies"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              ></path>
            </svg>
            Kho Phim
          </button>

          {/* Nút: Quản lý Suất chiếu */}
          <button
            onClick={() => setActiveTab("showtimes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "showtimes"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Suất Chiếu
          </button>

          <button
            onClick={() => setActiveTab("rooms")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "rooms"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Quản Lý Phòng
          </button>

          <button
            onClick={() => setActiveTab("cinemas")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "cinemas"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                />
              </svg>
            </svg>
            Quản Lý Rạp
          </button>

          <button
            onClick={() => setActiveTab("combo-bongnuoc")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "combo-bongnuoc"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                />
              </svg>
            </svg>
            Combo Bỏng Nước
          </button>

          {/* Nút: Thống kê (Làm mờ để demo) */}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium opacity-50 cursor-not-allowed">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            Thống Kê (Sắp ra mắt)
          </button>
        </nav>

        {/* User Profile Mini */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between group p-2 hover:bg-slate-800/50 rounded-xl transition-colors">
            <div className="flex items-center gap-3 cursor-pointer">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                alt="Admin"
                className="w-10 h-10 rounded-full border border-slate-700"
              />
              <div>
                <p className="text-sm font-bold text-white">Quản trị viên</p>
                <p className="text-xs text-slate-400">admin@cinemax.com</p>
              </div>
            </div>

            {/* NÚT ĐĂNG XUẤT CỦA BÁC Ở ĐÂY */}
            <div>
              <button
                title="Đăng xuất"
                className="text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200 flex items-center justify-center"
                onClick={handleLogout}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ================== MAIN CONTENT (Khu vực Phải) ================== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header trên cùng */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 z-10 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            {activeTab === "movies" && "Quản lý Kho Phim"}
            {activeTab === "showtimes" && "Quản lý Suất Chiếu"}
          </h2>

          <button className="relative p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        {/* Nơi nhét các component con (Render động) */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          <div className="absolute inset-0">
            {activeTab === "movies" && (
              <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                {<AdminMoviePage />}
              </div>
            )}

            {activeTab === "showtimes" && (
              <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                {<AdminShowtimePage />}
              </div>
            )}

            {activeTab === "cinemas" && (
              <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                {<AdminCinemaPage />}
              </div>
            )}

            {activeTab === "rooms" && (
              <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                {<AdminRoomPage />}
              </div>
            )}
            {activeTab === "combo-bongnuoc" && (
              <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                {<AdminComboBongNuoc />}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
