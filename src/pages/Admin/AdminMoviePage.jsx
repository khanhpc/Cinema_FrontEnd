import React, { useState, useEffect } from "react";
import api from "../../service/api";
import Swal from "sweetalert2";

const AdminMoviePage = () => {
  // GIỮ NGUYÊN STATE
  const [localMovies, setLocalMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    fetchLocalMovies();
  }, []);

  // GIỮ NGUYÊN LOGIC FETCH
  const fetchLocalMovies = async () => {
    try {
      const response = await api.get("/admin/movies");
      setLocalMovies(response.data);
    } catch (error) {
      console.error("Lỗi lấy phim:", error);
    }
  };

  // GIỮ NGUYÊN LOGIC SEARCH TMDB
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

  // GIỮ NGUYÊN LOGIC IMPORT
  const handleImportMovie = async (tmdbId) => {
    try {
      await api.post(`/admin/movies/import/${tmdbId}`);
      Swal.fire({
        title: "Import thành công!",
        text: `Đã đưa phim vào kho dữ liệu của rạp`,
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

  // GIỮ NGUYÊN LOGIC DELETE
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
        {/* ================= KHU VỰC 1: TÌM KIẾM TRÊN TMDB (GLASSMORPHISM) ================= */}
        <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[40px] border border-zinc-800 shadow-2xl overflow-hidden">
          <div className="p-8 lg:p-10 bg-gradient-to-br from-rose-500/10 to-transparent border-b border-zinc-800/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-600/20">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
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
                className={`px-10 py-5 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-3 min-w-[180px]
                ${
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

          {/* Kết quả trả về từ TMDB */}
          {tmdbResults.length > 0 && (
            <div className="p-8 lg:p-10 animate-slideInRight">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-5 bg-rose-600 rounded-full"></span>
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
                  Kết quả tìm thấy ({tmdbResults.length} phim)
                </h3>
              </div>

              {/* Scroll ngang mượt mà */}
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
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                        IMPORT PHIM
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= KHU VỰC 2: PHIM ĐANG CÓ (MODERN TABLE) ================= */}
        <div className="bg-zinc-900/30 backdrop-blur-md rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-rose-600 rounded-full"></div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Kho phim hệ thống
              </h2>
            </div>
            <span className="bg-zinc-800 text-rose-500 px-4 py-1.5 rounded-full text-[11px] font-black uppercase border border-zinc-700 tracking-wider">
              {localMovies.length} phim đang chiếu
            </span>
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
                  localMovies.map((movie) => (
                    <tr
                      key={movie.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-zinc-700 group-hover:text-rose-500 transition-colors">
                            #{movie.id}
                          </span>
                          <span className="font-black text-white text-base group-hover:text-rose-500 transition-colors uppercase tracking-tight">
                            {movie.title}
                          </span>
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

                      <td className="px-8 py-6 text-center">
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="text-zinc-600 hover:text-white hover:bg-rose-600 p-3 rounded-2xl transition-all duration-300 shadow-sm active:scale-90"
                          title="Gỡ phim khỏi hệ thống"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        
        .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #e11d48; }
      `}</style>
    </div>
  );
};

export default AdminMoviePage;
