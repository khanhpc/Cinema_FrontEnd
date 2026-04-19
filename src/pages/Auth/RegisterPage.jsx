import React, { useState } from "react";
import api from "../../service/api";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/public/register", { email, password });

            alert("Đăng ký thành công!");
            navigate("/login");
        } catch (error) {
            alert("Email này đã tồn tại!");
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
                    <p className="text-slate-500 text-sm font-medium">Đăng ký</p>
                </a>

                {/* FORM AREA */}
                <div className="p-8 md:p-10">
                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* Input Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 block">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
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
                                    placeholder="admin@cinema.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none bg-slate-50 focus:bg-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Input Mật khẩu */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700 block">
                                    Mật khẩu
                                </label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
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
                                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none bg-slate-50 focus:bg-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Nút Đăng ký */}
                        <button
                            type="submit"
                            className="w-full mt-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <span>ĐĂNG KÝ TÀI KHOẢN</span>
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
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                ></path>
                            </svg>
                        </button>
                        <a
                            href="/login"
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-end gap-1"
                        >
                            Quay Lại
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
