import React, { useState, useEffect, useRef } from "react";
import api from "../../service/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AdminShowtimePage = () => {
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [expandedMovies, setExpandedMovies] = useState({});
  const [expandedCinemas, setExpandedCinemas] = useState({}); // State mới để quản lý đóng mở Rạp
  const [form, setForm] = useState({
    movieId: "",
    roomId: "",
    startTime: "",
    price: "",
    tempCinemaId: "",
  });

  const dateInputRef = useRef(null);

  useEffect(() => {
    fetchShowtimes();
    api.get("/admin/movies").then((res) => setMovies(res.data));
    api.get("/admin/rooms").then((res) => setRooms(res.data));
  }, []);

  const fetchShowtimes = async () => {
    try {
      const response = await api.get("/admin/showtimes");
      const now = new Date();
      // CHỈ HIỆN SUẤT CHIẾU SẮP TỚI
      const upcoming = response.data
        .filter((st) => new Date(st.startTime) >= now)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      setShowtimes(upcoming);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/showtimes/create", {
        movieId: form.movieId,
        roomId: form.roomId,
        startTime: form.startTime,
        price: form.price,
      });
      toast.success("Lên lịch thành công bác nhé!");
      setForm({
        movieId: "",
        roomId: "",
        startTime: "",
        price: "",
        tempCinemaId: "",
      });
      fetchShowtimes();
    } catch (error) {
      Swal.fire({
        title: "Lỗi trùng lịch!",
        text: error.response?.data?.error || "Giờ này phòng đã bận rồi!",
        icon: "error",
        background: "#18181b",
        color: "#fff",
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Xác nhận xóa?",
      text: "Suất chiếu sẽ bị gỡ khỏi hệ thống!",
      icon: "warning",
      showCancelButton: true,
      background: "#18181b",
      color: "#fff",
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Xóa ngay",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/showtimes/delete/${id}`);
          toast.success("Đã xóa!");
          fetchShowtimes();
        } catch (error) {
          toast.error("Không xóa được suất này!");
        }
      }
    });
  };

  const toggleMovie = (id) => {
    setExpandedMovies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCinema = (movieId, cinemaId) => {
    const key = `${movieId}-${cinemaId}`;
    setExpandedCinemas((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // GOM NHÓM DỮ LIỆU 3 TẦNG: PHIM -> RẠP -> NGÀY
  const groupedData = showtimes.reduce((acc, st) => {
    const mId = st.movie.id;
    const cId = st.room.cinema.id;
    const dateKey = st.startTime.split("T")[0];

    if (!acc[mId]) acc[mId] = { info: st.movie, cinemas: {} };
    if (!acc[mId].cinemas[cId])
      acc[mId].cinemas[cId] = { info: st.room.cinema, dates: {} };
    if (!acc[mId].cinemas[cId].dates[dateKey])
      acc[mId].cinemas[cId].dates[dateKey] = [];

    acc[mId].cinemas[cId].dates[dateKey].push(st);
    return acc;
  }, {});

  return (
    <div className="h-full bg-transparent p-4 lg:p-8 font-sans text-zinc-300 pb-32 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ================= THIẾT LẬP SUẤT CHIẾU (FORM CÂN ĐỐI) ================= */}
        <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[40px] border border-zinc-800 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800/50 bg-gradient-to-r from-rose-500/5 to-transparent">
            <h2 className="text-lg font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-1.5 h-6 bg-rose-600 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.5)]"></span>
              Thiết lập suất chiếu
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* HÀNG 1: PHIM - RẠP - PHÒNG */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">
                  1. Chọn Phim
                </label>
                <select
                  className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white outline-none focus:border-rose-500 transition-all cursor-pointer appearance-none"
                  value={form.movieId}
                  onChange={(e) =>
                    setForm({ ...form, movieId: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    -- Chọn phim --
                  </option>
                  {movies.map((m) => (
                    <option key={m.id} value={m.id} className="bg-zinc-900">
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">
                  2. Chọn Rạp
                </label>
                <select
                  className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white outline-none focus:border-rose-500 transition-all cursor-pointer appearance-none"
                  value={form.tempCinemaId || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tempCinemaId: e.target.value,
                      roomId: "",
                    })
                  }
                  required
                >
                  <option value="" disabled>
                    -- Chọn rạp --
                  </option>
                  {Array.from(new Set(rooms.map((r) => r.cinema?.id)))
                    .filter(Boolean)
                    .map((id) => (
                      <option key={id} value={id} className="bg-zinc-900">
                        {rooms.find((r) => r.cinema?.id === id)?.cinema?.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">
                  3. Chọn Phòng
                </label>
                <select
                  className={`w-full p-4 border rounded-2xl text-white outline-none transition-all appearance-none ${!form.tempCinemaId ? "bg-zinc-800/30 border-zinc-900 text-zinc-700" : "bg-zinc-950/50 border-zinc-800 focus:border-rose-500"}`}
                  value={form.roomId}
                  onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                  required
                  disabled={!form.tempCinemaId}
                >
                  <option value="" disabled>
                    -- Chọn phòng --
                  </option>
                  {rooms
                    .filter(
                      (r) =>
                        r.cinema?.id.toString() ===
                        form.tempCinemaId?.toString(),
                    )
                    .map((r) => (
                      <option key={r.id} value={r.id} className="bg-zinc-900">
                        {r.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* HÀNG 2: NGÀY GIỜ (TRÁI) - GIÁ (GIỮA) - XÁC NHẬN (PHẢI) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end pt-6 border-t border-zinc-800/50">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-rose-500 uppercase ml-1 tracking-widest">
                  4. Thời gian chiếu
                </label>
                <div
                  onClick={() => dateInputRef.current.showPicker()}
                  className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 flex items-center hover:border-rose-500 transition-all cursor-pointer"
                >
                  <input
                    ref={dateInputRef}
                    type="datetime-local"
                    className="bg-transparent text-white font-bold text-sm outline-none w-full cursor-pointer"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">
                  5. Giá vé niêm yết (VNĐ)
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    placeholder="50000"
                    className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white font-black focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all pr-12"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                    min="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold group-focus-within:text-amber-500 transition-colors">
                    đ
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="h-16 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-rose-600/20 active:scale-95 uppercase text-sm tracking-[0.2em]"
              >
                Xác nhận lên lịch
              </button>
            </div>
          </form>
        </div>

        {/* ================= DANH SÁCH LỊCH CHIẾU (3 TẦNG ACCORDION) ================= */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter ml-2 flex items-center gap-3">
            <span className="text-2xl drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]">
              🎞️
            </span>{" "}
            Lịch chiếu hệ thống
          </h2>

          {Object.values(groupedData).map((movie) => (
            <div
              key={movie.info.id}
              className="bg-zinc-900/40 backdrop-blur-md rounded-[35px] border border-zinc-800 overflow-hidden shadow-2xl transition-all mb-6"
            >
              {/* PHIM (LEVEL 1) */}
              <div
                onClick={() => toggleMovie(movie.info.id)}
                className="p-6 flex items-center gap-6 cursor-pointer hover:bg-white/5 transition-all"
              >
                <img
                  src={movie.info.posterUrl}
                  className="w-16 h-24 rounded-2xl object-cover border border-white/10 shadow-lg"
                  alt="poster"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    {movie.info.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
                    ⏱️ {movie.info.duration} Phút • Đang có{" "}
                    {Object.keys(movie.cinemas).length} Rạp chiếu
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 transition-all duration-500 ${expandedMovies[movie.info.id] ? "rotate-180 bg-rose-600 text-white border-rose-600" : "hover:text-rose-500"}`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* RẠP (LEVEL 2) */}
              {expandedMovies[movie.info.id] && (
                <div className="p-8 pt-0 space-y-4 animate-fadeIn bg-black/20">
                  {Object.values(movie.cinemas).map((cinema) => {
                    const cinKey = `${movie.info.id}-${cinema.info.id}`;
                    const isCinExpanded = expandedCinemas[cinKey];
                    return (
                      <div
                        key={cinema.info.id}
                        className="rounded-3xl border border-zinc-800 overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            toggleCinema(movie.info.id, cinema.info.id)
                          }
                          className="w-full p-5 bg-zinc-900/80 flex items-center justify-between hover:bg-zinc-800 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">📍</span>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">
                              {cinema.info.name}
                            </h4>
                          </div>
                          <div
                            className={`transition-transform duration-300 ${isCinExpanded ? "rotate-180 text-rose-500" : "text-zinc-600"}`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 9l-7 7-7-7" strokeWidth="3" />
                            </svg>
                          </div>
                        </button>

                        {/* NGÀY & GIỜ (LEVEL 3) */}
                        {isCinExpanded && (
                          <div className="p-6 space-y-10 bg-zinc-950/50 animate-fadeIn">
                            {Object.keys(cinema.dates)
                              .sort()
                              .map((date) => (
                                <div
                                  key={date}
                                  className="space-y-4 border-l-2 border-zinc-800 pl-6 relative"
                                >
                                  <div className="absolute top-0 -left-[5px] w-2 h-2 bg-rose-600 rounded-full shadow-[0_0_8px_rgba(225,29,72,1)]"></div>
                                  <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">
                                    {new Date(date).toLocaleDateString(
                                      "vi-VN",
                                      {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                      },
                                    )}
                                  </h5>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {cinema.dates[date].map((st) => (
                                      <div
                                        key={st.id}
                                        className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group hover:border-amber-500/50 transition-all shadow-lg relative overflow-hidden"
                                      >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                                        <div>
                                          <p className="text-lg font-black text-white tracking-tighter">
                                            {new Date(
                                              st.startTime,
                                            ).toLocaleTimeString("vi-VN", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}
                                          </p>
                                          <p className="text-[10px] text-zinc-500 font-bold uppercase truncate max-w-[120px]">
                                            Phòng {st.room.name}
                                          </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                          <span className="text-[10px] font-black text-amber-500">
                                            {st.price.toLocaleString()}đ
                                          </span>
                                          <button
                                            onClick={() => handleDelete(st.id)}
                                            className="text-zinc-700 hover:text-rose-500 transition-colors p-1"
                                          >
                                            <svg
                                              className="w-5 h-5"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                d="M6 18L18 6M6 6l12 12"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
      `}</style>
    </div>
  );
};

export default AdminShowtimePage;
