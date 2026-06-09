import React, { useState, useEffect } from "react";
import api from "../../service/api";
import Swal from "sweetalert2";
import { MoveLeft, Save, Film, Calendar, Clock, Image } from "lucide-react";

// ĐÓN PROPS ĐỂ PHỤC VỤ GIẢI PHÁP TAB CON NGẦM
const AdminEditMoviePage = ({ movieId, onBack }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState(true);

    const [editForm, setEditForm] = useState({
        title: "",
        posterUrl: "",
        trailerUrl: "",
        duration: "",
        releaseDate: "",
        description: "",
    });

    useEffect(() => {
        fetchMovieDetail();
    }, [movieId]);

    const fetchMovieDetail = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/public/movies/${movieId}`);
            const movie = response.data;

            setEditForm({
                title: movie.title || "",
                posterUrl: movie.posterUrl || "",
                trailerUrl: movie.trailerUrl || "",
                duration: movie.duration || "",
                releaseDate: movie.releaseDate || "",
                description: movie.description || "",
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Lỗi tải dữ liệu",
                text: "Không tìm thấy bộ phim này hệ thống bác ơi!",
                icon: "error",
                background: "#18181b",
                color: "#fff",
            });
            onBack(); // Lỗi phát trả về trang cũ luôn
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMovie = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await api.put(`/admin/movies/update/${movieId}`, {
                title: editForm.title,
                posterUrl: editForm.posterUrl,
                trailerUrl: editForm.trailerUrl || null,
                duration: parseInt(editForm.duration),
                releaseDate: editForm.releaseDate || null,
                description: editForm.description,
            });

            await Swal.fire({
                title: "Thành công!",
                text: "Đã cập nhật thông tin phim lên hệ thống.",
                icon: "success",
                background: "#18181b",
                color: "#fff",
                confirmButtonColor: "#e11d48",
            });

            onBack(); // Cập nhật xong tự động tháo mác, back về kho phim
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Lỗi cập nhật",
                text: "Không thể lưu chỉnh sửa, bác kiểm tra lại nhé!",
                icon: "error",
                background: "#18181b",
                color: "#fff",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-40">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500/20 border-t-rose-600"></div>
                    <p className="text-zinc-600 font-black text-xs uppercase tracking-widest">Đang tải dữ liệu phim...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate-fadeIn">
            {/* THANH ĐIỀU HƯỚNG QUAY LẠI CHẠY BẰNG ONBACK */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 bg-zinc-900/60 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/5 hover:border-rose-500/50 hover:bg-zinc-900 transition-all text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-white group"
            >
                <MoveLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Quay lại kho phim
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* CỘT TRÁI: XEM TRƯỚC IMAGE PREVIEW */}
                <div className="lg:col-span-1 bg-zinc-900/40 backdrop-blur-xl p-6 rounded-[35px] border border-zinc-800 space-y-4 flex flex-col items-center">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center block">Giao diện hiển thị Poster</span>
                    <div className="w-full max-w-[260px] aspect-[2/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950">
                        <img
                            src={editForm.posterUrl ? (editForm.posterUrl.startsWith("http") ? editForm.posterUrl : `https://image.tmdb.org/t/p/w500${editForm.posterUrl}`) : "https://via.placeholder.com/400x600?text=No+Poster"}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=Link+Anh+Loi"; }}
                        />
                    </div>
                    <p className="text-xs font-black text-zinc-400 uppercase text-center max-w-[240px] line-clamp-1 italic">{editForm.title || "Chưa nhập tên phim"}</p>
                </div>

                {/* CỘT PHẢI: KHUNG EDIT RỘNG RÃI BAO LA */}
                <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl p-8 rounded-[40px] border border-zinc-800 shadow-2xl">
                    <div className="mb-6 border-b border-zinc-800 pb-4">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Chỉnh sửa thông tin phim</h2>
                        <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-0.5">Nâng cấp không gian quản trị hệ thống</p>
                    </div>

                    <form onSubmit={handleUpdateMovie} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Tên bộ phim</label>
                                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-rose-500 transition-all font-bold" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Clock size={12} /> Thời lượng (Phút)</label>
                                <input type="number" value={editForm.duration} onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-rose-500 transition-all font-bold" required />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Image size={12} /> Đường dẫn ảnh Poster URL</label>
                            <input type="text" value={editForm.posterUrl} onChange={(e) => setEditForm({ ...editForm, posterUrl: e.target.value })} className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-rose-500 transition-all" required />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Film size={12} /> Mã / Đường dẫn Trailer Youtube</label>
                                <input type="text" value={editForm.trailerUrl} placeholder="Mã video hoặc link YouTube" onChange={(e) => setEditForm({ ...editForm, trailerUrl: e.target.value })} className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-rose-500 transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Calendar size={12} /> Ngày phát hành phim</label>
                                <input type="date" value={editForm.releaseDate} onChange={(e) => setEditForm({ ...editForm, releaseDate: e.target.value })} className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-rose-500 transition-all text-zinc-400 font-bold" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Tóm tắt nội dung cốt truyện phim</label>
                            <textarea value={editForm.description} rows={6} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-rose-500 transition-all resize-none custom-scroll leading-relaxed" placeholder="Nhập nội dung mô tả chi tiết cốt truyện phim..." />
                        </div>

                        <button type="submit" disabled={isUpdating} className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all duration-300 shadow-xl shadow-rose-600/10 active:scale-[0.98] uppercase text-xs tracking-widest flex items-center justify-center gap-2 mt-2">
                            {isUpdating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save size={16} /> Lưu thay đổi hệ thống</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminEditMoviePage;