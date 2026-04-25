import React, { useState, useEffect } from "react";
import api from "../../service/api";
import Swal from "sweetalert2";
const AdminMoviePage = () => {
  // State cho dữ liệu nội bộ
  const [localMovies, setLocalMovies] = useState([]);

  // State cho việc tìm kiếm trên TMDB
  const [searchQuery, setSearchQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
      // Gọi thẳng lên API của TMDB
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=vi-VN&query=${searchQuery}`,
      );
      const data = await response.json();
      setTmdbResults(data.results || []);
    } catch (error) {
      alert("Lỗi khi tìm kiếm trên TMDB!");
    } finally {
      setIsSearching(false);
    }
  };

  const handleImportMovie = async (tmdbId) => {
    try {
      await api.post(`/admin/movies/import/${tmdbId}`);
      Swal.fire({
        title: 'Thêm Film thành công',
        text: `Đã Import thành công phim có ID: ${tmdbId}`,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      })

      setTmdbResults([]);
      setSearchQuery("");
      fetchLocalMovies();
    } catch (error) {
      alert("Lỗi khi Import phim (Có thể phim này đã tồn tại trong DB)!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bác có chắc muốn xóa phim này khỏi rạp không?")) {
      try {
        await api.delete(`/admin/movies/delete/${id}`);
        fetchLocalMovies();
      } catch (error) {
        alert("Không thể xóa phim này (có thể do đang có lịch chiếu)!");
      }
    }
  };

  return (
    // Đã sửa dòng này: Dùng h-full và overflow-y-auto thay vì min-h-screen
    <div className="h-full overflow-y-auto bg-slate-50 p-6 md:p-8 font-sans text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* KHU VỰC 1: TÌM KIẾM TRÊN TMDB */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 lg:p-8 bg-blue-50/50 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                Tìm kiếm phim trên TMDB
              </h2>
            </div>

            <form
              onSubmit={searchTMDB}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nhập tên phim (Ví dụ: Lật Mặt, Mai...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-3.5 border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className={`px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px]
                ${isSearching
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 active:scale-[0.98]"
                  }`}
              >
                {isSearching ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang tìm...
                  </>
                ) : (
                  "TÌM KIẾM"
                )}
              </button>
            </form>
          </div>

          {/* Kết quả trả về từ TMDB */}
          {tmdbResults.length > 0 && (
            <div className="p-6 lg:p-8">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Kết quả tìm kiếm ({tmdbResults.length} phim)
              </h3>

              {/* Scroll ngang chứa các thẻ phim */}
              <div className="flex gap-6 overflow-x-auto pb-6 snap-x pt-2">
                {tmdbResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="min-w-[180px] max-w-[180px] bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 snap-start"
                  >
                    <div className="relative h-[270px] overflow-hidden bg-slate-100">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                            : "https://via.placeholder.com/200x300?text=No+Image"
                        }
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <h4
                        className="font-bold text-slate-800 text-sm line-clamp-2 mb-3"
                        title={movie.title}
                      >
                        {movie.title}
                      </h4>
                      <button
                        onClick={() => handleImportMovie(movie.id)}
                        className="mt-auto w-full bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 hover:border-emerald-500 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-1.5"
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
                          ></path>
                        </svg>
                        Import
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* KHU VỰC 2: PHIM ĐANG CÓ TRONG RẠP */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              🎞️ Danh sách phim trong hệ thống
            </h2>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
              {localMovies.length} phim
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID Nội Bộ</th>
                  <th className="px-6 py-4">TMDB ID</th>
                  <th className="px-6 py-4">Tên phim</th>
                  <th className="px-6 py-4">Ngày chiếu</th>
                  <th className="px-6 py-4">Thời lượng</th>
                  <th className="px-6 py-4 text-center">Hành động</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {localMovies.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-16">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <svg
                          className="w-12 h-12 mb-3 text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                          ></path>
                        </svg>
                        <p className="text-base font-medium text-slate-500">
                          Kho phim đang trống
                        </p>
                        <p className="text-sm mt-1">
                          Hãy tìm và import phim từ TMDB ở phía trên.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  localMovies.map((movie) => (
                    <tr
                      key={movie.id}
                      className="hover:bg-slate-50/80 transition duration-150 group"
                    >
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        #{movie.id}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold font-mono">
                          {movie.tmdbId}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-800">
                        {movie.title}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {movie.releaseDate}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {movie.duration} Phút
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                          title="Xóa phim này"
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
                            ></path>
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
    </div>
  );
};

export default AdminMoviePage;
