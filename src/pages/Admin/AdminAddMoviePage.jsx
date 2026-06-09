import React, { useState } from "react";
import api from "../../service/api";
import Swal from "sweetalert2";
import { MoveLeft, Plus, Film, Calendar, Clock, Image, FileText } from "lucide-react";

const AdminAddMoviePage = ({ onBack }) => {
    const [isAdding, setIsAdding] = useState(false);

    const [addForm, setAddForm] = useState({
        title: "",
        posterUrl: "",
        trailerUrl: "",
        duration: "",
        releaseDate: "",
        description: "",
    });

    const handleAddMovieManual = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const payload = [
                {
                    title: addForm.title,
                    posterUrl: addForm.posterUrl,
                    trailerUrl: addForm.trailerUrl || null,
                    duration: parseInt(addForm.duration),
                    releaseDate: addForm.releaseDate || null,
                    description: addForm.description,
                    tmdbId: null,
                    avgRating: 0.0,
                    deleted: false,
                },
            ];

            await api.post("/admin/movies/import", payload);

            await Swal.fire({
                title: "Thành công!",
                text: "Đã thêm bộ phim thủ công mới vào hệ thống rạp.",
                icon: "success",
                background: "#18181b",
                color: "#fff",
                confirmButtonColor: "#e11d48",
            });

            onBack();
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Lỗi thêm phim",
                text: "Hệ thống gặp sự cố, bác kiểm tra lại mạng hoặc backend nhé!",
                icon: "error",
                background: "#18181b",
                color: "#fff",
            });
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="w-full space-y-8 animate-fadeIn">
            {/* NÚT BACK CHUYỂN VÙNG VỀ KHO PHIM CHÍNH */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 bg-zinc-900/60 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/5 hover:border-rose-500/50 hover:bg-zinc-900 transition-all text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-white group"
            >
                <MoveLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Quay lại kho phim
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* CỘT TRÁI: LIVE PREVIEW POSTER (TIỆN LỢI ĐỂ KIỂM TRA LINK CGV/MẠNG) */}
                <div className="lg:col-span-1 bg-zinc-900/40 backdrop-blur-xl p-6 rounded-[35px] border border-zinc-800 space-y-4 flex flex-col items-center">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center block">Xem trước ảnh thiết kế</span>
                    <div className="w-full max-w-[260px] aspect-[2/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 flex items-center justify-center">
                        {addForm.posterUrl ? (
                            <img
                                src={addForm.posterUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=Link+Anh+Loi+Bac+Oi"; }}
                            />
                        ) : (
                            <div className="text-center p-6 text-zinc-700 font-bold text-xs uppercase tracking-wider space-y-2">
                                <Image className="mx-auto text-zinc-800 animate-pulse" size={32} />
                                <p>Chưa có link ảnh<br />Poster</p>
                            </div>
                        )}
                    </div>
                    <p className="text-xs font-black text-rose-500 uppercase text-center max-w-[240px] line-clamp-1 italic">
                        {addForm.title || "TÊN PHIM MỚI"}
                    </p>
                </div>

                {/* CỘT PHẢI: FORM NHẬP FULL-VIEW BAO LA RỘNG RÃI */}
                <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl p-8 rounded-[40px] border border-zinc-800 shadow-2xl">
                    <div className="mb-6 border-b border-zinc-800 pb-4">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Khởi tạo phim thủ công</h2>
                        <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-0.5">Tự tay thiết kế dữ liệu điện ảnh độc quyền</p>
                    </div>

                    <form onSubmit={handleAddMovieManual} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Tên bộ phim *</label>
                                <input
                                    type="text"
                                    value={addForm.title}
                                    onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                                    className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-rose-500 transition-all font-bold placeholder:text-zinc-800"
                                    placeholder="Nhập tên phim"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Clock size={12} /> Thời lượng (Phút) *</label>
                                <input
                                    type="number"
                                    value={addForm.duration}
                                    onChange={(e) => setAddForm({ ...addForm, duration: e.target.value })}
                                    className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-rose-500 transition-all font-bold placeholder:text-zinc-800"
                                    placeholder="Ví dụ: 120"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Image size={12} /> Đường dẫn ảnh Poster URL *</label>
                            <input
                                type="text"
                                value={addForm.posterUrl}
                                onChange={(e) => setAddForm({ ...addForm, posterUrl: e.target.value })}
                                className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-rose-500 transition-all placeholder:text-zinc-800"
                                placeholder="Dán link ảnh full của CGV, VCDN hoặc mạng vào đây"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Film size={12} /> Mã Trailer Youtube</label>
                                <input
                                    type="text"
                                    value={addForm.trailerUrl}
                                    placeholder="Ví dụ: dQw4w9WgXcQ (hoặc để trống)"
                                    onChange={(e) => setAddForm({ ...addForm, trailerUrl: e.target.value })}
                                    className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-rose-500 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Calendar size={12} /> Ngày phát hành phim</label>
                                <input
                                    type="date"
                                    value={addForm.releaseDate}
                                    onChange={(e) => setAddForm({ ...addForm, releaseDate: e.target.value })}
                                    className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-rose-500 transition-all text-zinc-400 font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><FileText size={12} /> Tóm tắt nội dung cốt truyện phim</label>
                            <textarea
                                value={addForm.description}
                                rows={6}
                                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                                className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-rose-500 transition-all resize-none custom-scroll leading-relaxed placeholder:text-zinc-800"
                                placeholder="Nhập nội dung mô tả chi tiết cốt truyện phim..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isAdding}
                            className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all duration-300 shadow-xl shadow-rose-600/10 active:scale-[0.98] uppercase text-xs tracking-widest flex items-center justify-center gap-2 mt-2"
                        >
                            {isAdding ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Plus size={16} /> Tạo phim thủ công ngay
                                </>
                            )}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default AdminAddMoviePage;