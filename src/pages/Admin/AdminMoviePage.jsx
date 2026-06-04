import React, { useState, useEffect } from "react";
import api from "../../service/api";
import Swal from "sweetalert2";
import { Search, Download, Trash2, Edit2, RefreshCw, X } from "lucide-react";

const AdminMoviePage = () => {
  const [localMovies, setLocalMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRatingSyncing, setIsRatingSyncing] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    duration: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    fetchLocalMovies();
  }, []);

  const fetchLocalMovies = async () => {
    try {
      const response = await api.get("/admin/movies");
      setLocalMovies(response.data);
    } catch (error) {
      console.error("Lỗi lấy phim:", error);
    }
  };

  const searchTMDB = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=vi-VN&query=${searchQuery}`,
      );
      const data = await response.json();
      setTmdbResults(data.results || []);
    } catch (error) {
      Swal.fire({
        title: "Lỗi tìm kiếm",
        text: "Không thể kết nối tới TMDB bác ạ!",
        icon: "error",
        background: "#18181b",
        color: "#fff",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleImportMovie = async (tmdbId) => {
    try {
      await api.post(`/admin/movies/import/${tmdbId}`);
      Swal.fire({
        title: "Import thành công!",
        text: "Đã đưa phim vào kho dữ liệu của rạp",
        icon: "success",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#e11d48",
      });
      setTmdbResults([]);
      setSearchQuery("");
      fetchLocalMovies();
    } catch (error) {
      Swal.fire({
        title: "Lỗi Import",
        text: "Phim này có vẻ đã tồn tại trong kho rồi bác ơi!",
        icon: "warning",
        background: "#18181b",
        color: "#fff",
      });
    }
  };

  const handleSyncAllRatings = async () => {
    if (localMovies.length === 0) return;
    setIsRatingSyncing(true);
    try {
      const syncPromises = localMovies.map((movie) =>
        api.get(`/admin/movies/update-rating/${movie.id}`),
      );
      await Promise.all(syncPromises);

      Swal.fire({
        title: "Đồng bộ hoàn tất!",
        text: "Điểm số của toàn bộ kho phim đã được cập nhật mới nhất từ bình luận.",
        icon: "success",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#e11d48",
      });
      fetchLocalMovies();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Thất bại",
        text: "Không thể cập nhật rating tự động lúc này bác ơi!",
        icon: "error",
        background: "#18181b",
        color: "#fff",
      });
    } finally {
      setIsRatingSyncing(false);
    }
  };

  const openEditModal = (movie) => {
    setEditForm({
      id: movie.id,
      title: movie.title,
      duration: movie.duration,
      avgRating: movie.avgRating || 0.0,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.put(`/admin/movies/update/${editForm.id}`, {
        title: editForm.title,
        duration: parseInt(editForm.duration),
        avgRating: parseFloat(editForm.avgRating),
      });
      Swal.fire({
        title: "Thành công!",
        text: "Đã cập nhật thông tin phim.",
        icon: "success",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#e11d48",
      });
      setIsEditModalOpen(false);
      fetchLocalMovies();
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

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Xóa phim này?",
      text: "Phim sẽ bị gỡ khỏi rạp vĩnh viễn đó bác!",
      icon: "warning",
      showCancelButton: true,
      background: "#18181b",
      color: "#fff",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#27272a",
      confirmButtonText: "Đúng, xóa nó!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/movies/delete/${id}`);
          fetchLocalMovies();
          Swal.fire({
            title: "Đã xóa!",
            icon: "success",
            background: "#18181b",
            color: "#fff",
          });
        } catch (error) {
          Swal.fire({
            title: "Lỗi xóa phim",
            text: "Không thể xóa phim này (có thể do đang có lịch chiếu)!",
            icon: "error",
            background: "#18181b",
            color: "#fff",
          });
        }
      }
    });
  };

  return (
    <div className="h-full bg-transparent p-4 lg:p-8 font-sans text-zinc-300 pb-32 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[40px] border border-zinc-800 shadow-2xl overflow-hidden">
          <div className="p-8 lg:p-10 bg-gradient-to-br from-rose-500/10 to-transparent border-b border-zinc-800/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-600/20">
                <Search size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  Tìm kiếm trên TMDB
                </h2>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1 opacity-60">
                  Kết nối trực tiếp tới kho phim thế giới
                </p>
              </div>
            </div>

            <form
              onSubmit={searchTMDB}
              className="flex flex-col sm:flex-row gap-5"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nhập tên phim cần tìm (Ví dụ: Joker, Avengers...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-6 pr-12 py-5 bg-zinc-950/50 border border-zinc-800 rounded-[20px] text-white placeholder-zinc-700 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className={`px-10 py-5 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-3 min-w-[180px] ${
                  isSearching
                    ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    : "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20 active:scale-95"
                }`}
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "TÌM KIẾM"
                )}
              </button>
            </form>
          </div>

          {tmdbResults.length > 0 && (
            <div className="p-8 lg:p-10 animate-slideInRight">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-5 bg-rose-600 rounded-full"></span>
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
                  Kết quả tìm thấy ({tmdbResults.length} phim)
                </h3>
              </div>

              <div className="flex gap-8 overflow-x-auto pb-6 custom-scroll snap-x pt-2">
                {tmdbResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="min-w-[200px] max-w-[200px] bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden flex flex-col group hover:border-rose-500/50 transition-all duration-500 snap-start shadow-xl"
                  >
                    <div className="relative h-[300px] overflow-hidden">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : "https://via.placeholder.com/300x450?text=No+Poster"
                        }
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h4
                        className="font-black text-white text-sm line-clamp-2 mb-4 h-10 uppercase tracking-tight"
                        title={movie.title}
                      >
                        {movie.title}
                      </h4>
                      <button
                        onClick={() => handleImportMovie(movie.id)}
                        className="mt-auto w-full bg-zinc-900 text-zinc-300 hover:bg-rose-600 hover:text-white border border-zinc-800 hover:border-rose-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Download size={14} />
                        IMPORT PHIM
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-zinc-900/30 backdrop-blur-md rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-zinc-900/50">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-rose-600 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.4)]"></div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Kho phim hệ thống
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSyncAllRatings}
                disabled={isRatingSyncing || localMovies.length === 0}
                className="bg-zinc-800 hover:bg-amber-500 border border-zinc-700 hover:border-amber-500 text-zinc-400 hover:text-black px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 disabled:opacity-40"
              >
                <RefreshCw
                  size={14}
                  className={isRatingSyncing ? "animate-spin" : ""}
                />
                Đồng bộ Rating
              </button>
              <span className="bg-zinc-800 text-rose-500 px-4 py-2 rounded-2xl text-[11px] font-black uppercase border border-zinc-700 tracking-wider">
                {localMovies.length} phim đang chiếu
              </span>
            </div>
          </div>

          <div className="overflow-x-auto custom-scroll">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/50 text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em]">
                  <th className="px-8 py-6">Phim</th>
                  <th className="px-8 py-6">Mã TMDB</th>
                  <th className="px-8 py-6">Phát hành</th>
                  <th className="px-8 py-6">Thời lượng</th>
                  <th className="px-8 py-6 text-center">Hành động</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/50">
                {localMovies.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-24">
                      <div className="flex flex-col items-center justify-center text-zinc-600 opacity-40">
                        <svg
                          className="w-20 h-20 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                          />
                        </svg>
                        <p className="text-lg font-bold uppercase tracking-widest">
                          Kho phim đang trống bác ơi
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  localMovies.map((movie, index) => (
                    <tr
                      key={movie.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-zinc-700 group-hover:text-rose-500 transition-colors">
                            #{index + 1}
                          </span>
                          <div className="space-y-1">
                            <span className="block font-black text-white text-base group-hover:text-rose-500 transition-colors uppercase tracking-tight">
                              {movie.title}
                            </span>
                            <span className="inline-block bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-[10px] px-2 py-0.5 rounded-md">
                              ⭐ Rating:{" "}
                              {movie.avgRating
                                ? movie.avgRating.toFixed(1)
                                : "0.0"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-lg text-[10px] font-black font-mono border border-zinc-700">
                          {movie.tmdbId}
                        </span>
                      </td>

                      <td className="px-8 py-6 text-zinc-500 font-bold text-sm tracking-tighter">
                        {movie.releaseDate}
                      </td>

                      <td className="px-8 py-6">
                        <span className="text-zinc-400 font-black text-xs uppercase">
                          {movie.duration} Phút
                        </span>
                      </td>

                      <td className="px-8 py-6 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(movie)}
                            className="text-zinc-600 hover:text-white hover:bg-zinc-800 p-3 rounded-2xl transition-all duration-300 active:scale-90"
                            title="Sửa thông tin phim"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(movie.id)}
                            className="text-zinc-600 hover:text-white hover:bg-rose-600 p-3 rounded-2xl transition-all duration-300 active:scale-90"
                            title="Gỡ phim khỏi hệ thống"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden relative animate-slideUp">
            <div className="px-8 py-6 border-b border-zinc-800/60 bg-gradient-to-r from-rose-500/10 to-transparent flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Cập nhật phim
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                  Sửa đổi thông số kho phim
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-rose-600 transition-all flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateMovie} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Tên bộ phim
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white focus:outline-none focus:border-rose-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Thời lượng (Phút)
                </label>
                <input
                  type="number"
                  value={editForm.duration}
                  onChange={(e) =>
                    setEditForm({ ...editForm, duration: e.target.value })
                  }
                  className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white focus:outline-none focus:border-rose-500 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all duration-300 shadow-xl shadow-rose-600/10 active:scale-[0.98] uppercase text-xs tracking-widest flex items-center justify-center gap-2 mt-4"
              >
                {isUpdating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Lưu Thay Đổi"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMoviePage;
