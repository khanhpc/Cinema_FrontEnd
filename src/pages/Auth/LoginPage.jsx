import React, { useState } from "react";
import api from "../../service/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/public/login", { email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      Swal.fire({
        title: 'Đăng nhập thành công',
        text: "Bác đã đăng nhập thành công",
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      })

      await delay(500);

      if (localStorage.getItem("role") === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Bác nhập sai tài khoản hoặc mật khẩu")
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER LOGO */}
        <a className="bg-slate-50 p-8 text-center border-b border-slate-100" href="/">
          <div style={{ color: '#e50914', fontSize: '24px', fontWeight: '900', letterSpacing: '2px' }}>
            🎬 CINEMA PLUS
          </div>
          <p className="text-slate-500 text-sm font-medium">Đăng nhập hệ thống</p>
        </a>

        {/* FORM AREA */}
        <div className="p-8 md:p-10">
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="admin@cinema.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none bg-slate-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Input Mật khẩu */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none bg-slate-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Nút Đăng Nhập */}
            <button
              type="submit"
              className="w-full mt-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>VÀO RẠP NGAY</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </button>

            {/* KHU VỰC LIÊN KẾT BỔ SUNG (Quên pass / Đăng ký) */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col items-center gap-3">
              <a
                href="#"
                className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Quên mật khẩu?
              </a>
              <p className="text-sm text-slate-500">
                Chưa có tài khoản?{" "}
                <a
                  href="/register"
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                >
                  Đăng ký ngay
                </a>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
