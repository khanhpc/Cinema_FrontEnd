import React, { useState } from "react";
import api from "../../service/api";
import { Link, useNavigate } from "react-router-dom";
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

      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      Swal.fire({
        title: "Chào mừng bác trở lại!",
        text: "Đăng nhập thành công, đặt vé ngay thôi!",
        icon: "success",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#e50914",
        confirmButtonText: "VÀO NGAY",
      });

      await delay(800);

      if (localStorage.getItem("role") === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Tài khoản hoặc mật khẩu không đúng rồi bác ơi!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Hiệu ứng đốm sáng mờ ảo phía sau */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-900/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full relative z-10">
        {/* NÚT QUAY LẠI TRANG CHỦ */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 font-bold text-sm group"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          QUAY LẠI
        </Link>

        {/* CARD CHÍNH (Glassmorphism) */}
        <div className="bg-zinc-900/50 backdrop-blur-2xl rounded-[40px] border border-zinc-800 shadow-2xl overflow-hidden">
          <div className="p-10 pb-6 text-center border-b border-zinc-800/50">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <div className="bg-rose-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-rose-600/30">
                C+
              </div>
              <span className="text-white font-black text-2xl tracking-tighter uppercase">
                Cinema Plus
              </span>
            </Link>
            <h2 className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
              Thành viên đăng nhập
            </h2>
          </div>

          <div className="p-10 pt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Input Email */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Địa chỉ Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-rose-500 transition-colors">
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
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Input Mật khẩu */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                    Mật khẩu
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-rose-500 transition-colors">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Nút Đăng Nhập */}
              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-rose-600/20 active:scale-[0.97] uppercase tracking-widest text-sm flex items-center justify-center gap-3 mt-4"
              >
                VÀO RẠP NGAY
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </button>

              {/* Đăng ký */}
              <div className="text-center pt-4">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-tight">
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="text-white hover:text-rose-500 transition-colors border-b border-zinc-700 hover:border-rose-500 pb-0.5 ml-1"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer trang đăng nhập */}
        <p className="text-center mt-10 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} KHANHDTK PRODUCTION.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
