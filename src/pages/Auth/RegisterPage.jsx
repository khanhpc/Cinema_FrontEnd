import React, { useState } from "react";
import api from "../../service/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/public/register", { email, password });

      // Hàm tạo độ trễ để người dùng kịp nhìn thấy thông báo thành công
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      toast.success("Chào mừng bác! Đăng ký thành công rồi nhé.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      await delay(1500); // Chờ 1.5 giây cho "ngầu"
      navigate("/login");
    } catch (error) {
      toast.error("Email này đã có người dùng rồi bác ơi!", {
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
      {/* Hiệu ứng ánh sáng nền mờ ảo (Cinematic Blobs) */}
      <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-900/20 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full relative z-10">
        {/* NÚT QUAY LẠI TRANG CHỦ */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-8 font-bold text-sm group"
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
          TRANG CHỦ
        </Link>

        {/* CARD ĐĂNG KÝ (Glassmorphism) */}
        <div className="bg-zinc-900/40 backdrop-blur-3xl rounded-[40px] border border-zinc-800 shadow-2xl overflow-hidden">
          {/* Header Card */}
          <div className="p-10 pb-6 text-center border-b border-zinc-800/50">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <div className="bg-rose-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-rose-600/30">
                C+
              </div>
              <span className="text-white font-black text-2xl tracking-tighter uppercase">
                Cinema Plus
              </span>
            </Link>

            <p className="text-zinc-500 text-xs font-bold mt-2 tracking-widest uppercase">
              Đăng Ký Tài Khoản Để Đặt Vé Xem Phim Online
            </p>
          </div>

          <div className="p-10 pt-8">
            <form onSubmit={handleRegister} className="space-y-6">
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
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Input Mật khẩu */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Mật khẩu
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Nút Đăng ký */}
              <button
                type="submit"
                className="w-full bg-white hover:bg-rose-600 text-zinc-950 hover:text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl active:scale-[0.97] uppercase tracking-widest text-sm flex items-center justify-center gap-3 mt-4"
              >
                ĐĂNG KÝ NGAY
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
                  />
                </svg>
              </button>

              {/* Link đăng nhập */}
              <div className="text-center pt-4">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-tight">
                  Đã có tài khoản rồi?{" "}
                  <Link
                    to="/login"
                    className="text-rose-500 hover:text-rose-400 transition-colors border-b border-rose-900/50 pb-0.5 ml-1"
                  >
                    Đăng nhập tại đây
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer bản quyền */}
        <p className="text-center mt-10 text-zinc-700 text-[10px] font-bold uppercase tracking-[0.4em]">
          © {new Date().getFullYear()} KHANHDTK PRODUCTION.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
