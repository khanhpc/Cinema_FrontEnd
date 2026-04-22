import React, { useState, useEffect } from "react";
import api from "../../service/api";
import toast from "react-hot-toast";

const AdminShowtimePage = () => {
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    movieId: "",
    roomId: "",
    startTime: "",
    price: "",
  });

  const [showtimes, setShowtimes] = useState([]);

  const [expandedMovies, setExpandedMovies] = useState({});

  useEffect(() => {
    fetchShowtimes();
    api.get("/admin/movies").then((res) => setMovies(res.data));
    api.get("/admin/rooms").then((res) => setRooms(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/showtimes/create", form);
      toast.success("Lên lịch thành công!");

      setForm({ movieId: "", roomId: "", startTime: "", price: "" });

      fetchShowtimes();
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi trùng lịch chiếu bác ơi!");
    }
  };

  const fetchShowtimes = async () => {
    try {
      const response = await api.get("/admin/showtimes");
      const now = new Date();
      const filteredAndSorted = response.data
        .filter((st) => new Date(st.startTime) >= now)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      setShowtimes(filteredAndSorted);
    } catch (error) {
      console.error("Lỗi lấy danh sách suất chiếu:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bác có chắc muốn xóa suất chiếu này không?")) {
      try {
        await api.delete(`/admin/showtimes/delete/${id}`);
      } catch (error) {
        alert("Không thể xóa suất chiếu này (có thể do đã có người đặt vé)!");
      } finally {
        fetchShowtimes();
      }
    }
  };

  const toggleMovieAccordion = (movieId) => {
    setExpandedMovies((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  };

  const groupedShowtimes = showtimes.reduce((acc, st) => {
    const movieId = st.movie.id;
    const cinemaId = st.room.cinema.id;
    const roomId = st.room.id;

    if (!acc[movieId]) {
      acc[movieId] = {
        movieInfo: st.movie,
        cinemas: {},
      };
    }

    if (!acc[movieId].cinemas[cinemaId]) {
      acc[movieId].cinemas[cinemaId] = {
        cinemaInfo: st.room.cinema,
        rooms: {},
      };
    }

    // 3. Tạo nhánh Phòng bên trong Rạp nếu chưa có
    if (!acc[movieId].cinemas[cinemaId].rooms[roomId]) {
      acc[movieId].cinemas[cinemaId].rooms[roomId] = {
        roomInfo: st.room,
        times: [],
      };
    }

    acc[movieId].cinemas[cinemaId].rooms[roomId].times.push(st);

    return acc;
  }, {});

  const groupedDataArray = Object.values(groupedShowtimes);

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 md:p-10 font-sans text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* KHU VỰC 1: FORM TẠO SUẤT CHIẾU */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
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
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              Tạo suất chiếu mới
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 items-end"
          >
            {/* 1. Chọn Phim */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">
                Phim
              </label>
              <select
                className="w-full border border-slate-300 rounded-xl p-3 bg-white text-slate-700 hover:border-slate-400 focus:border-blue-500 focus:ring-4 transition-all outline-none"
                value={form.movieId}
                onChange={(e) => setForm({ ...form, movieId: e.target.value })}
                required
              >
                <option value="" disabled>
                  -- Chọn phim --
                </option>
                {movies.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Chọn Rạp (TRƯỜNG MỚI THÊM) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">
                Rạp chiếu
              </label>
              <select
                className="w-full border border-slate-300 rounded-xl p-3 bg-white text-slate-700 hover:border-slate-400 focus:border-blue-500 focus:ring-4 transition-all outline-none"
                // Vì form chỉ lưu roomId lên server, ta dùng 1 state tạm (hoặc lấy từ roomId) để hiển thị rạp đang chọn.
                // Nhưng để đơn giản và chuẩn UX, ta cứ bắt Admin chọn rạp để lọc phòng.
                value={form.tempCinemaId || ""}
                onChange={(e) => {
                  setForm({
                    ...form,
                    tempCinemaId: e.target.value,
                    roomId: "", // Reset phòng khi đổi rạp!
                  });
                }}
                required
              >
                <option value="" disabled>
                  -- 1. Chọn rạp --
                </option>
                {/* Mẹo: Bác có mảng 'rooms' (phòng chứa info rạp). 
        Ta lọc ra danh sách rạp duy nhất từ mảng phòng này để làm tùy chọn.
      */}
                {Array.from(new Set(rooms.map((r) => r.cinema?.id)))
                  .filter(Boolean)
                  .map((cinemaId) => {
                    const cinemaName = rooms.find(
                      (r) => r.cinema?.id === cinemaId,
                    )?.cinema?.name;
                    return (
                      <option key={cinemaId} value={cinemaId}>
                        {cinemaName}
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* 3. Chọn Phòng (CHỈ HIỆN PHÒNG CỦA RẠP ĐÃ CHỌN) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">
                Phòng chiếu
              </label>
              <select
                className={`w-full border rounded-xl p-3 text-slate-700 transition-all outline-none ${
                  !form.tempCinemaId
                    ? "bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400"
                    : "bg-white border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-4"
                }`}
                value={form.roomId}
                onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                required
                disabled={!form.tempCinemaId} // Khóa lại nếu chưa chọn rạp
              >
                <option value="" disabled>
                  - 2. Chọn phòng -
                </option>

                {/* LOGIC LỌC: Chỉ map những phòng có id rạp trùng với rạp đang chọn */}
                {rooms
                  .filter(
                    (r) =>
                      r.cinema?.id.toString() === form.tempCinemaId?.toString(),
                  )
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* 4. Chọn Thời Gian */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">
                Thời gian
              </label>
              <input
                type="datetime-local"
                className="w-full border border-slate-300 rounded-xl p-3 text-slate-700 hover:border-slate-400 focus:border-blue-500 focus:ring-4 transition-all outline-none"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
                required
              />
            </div>

            {/* 5. Nhập Giá vé */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">
                Giá vé (VNĐ)
              </label>
              <input
                type="number"
                placeholder="VD: 50000"
                className="w-full border border-slate-300 rounded-xl p-3 text-slate-700 placeholder-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 transition-all outline-none"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                min="0"
              />
            </div>

            {/* 6. Nút Submit */}
            <button
              type="submit"
              className="w-full h-[50px] bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Lên lịch ngay
            </button>
          </form>
        </div>

        {/* KHU VỰC 2: DANH SÁCH SUẤT CHIẾU ĐƯỢC GOM NHÓM */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              📋 Quản lý lịch chiếu theo Phim
            </h2>
            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
              Tổng cộng: {showtimes.length} suất
            </span>
          </div>

          {groupedDataArray.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 py-16 text-center">
              <p className="text-slate-500 font-medium">
                Chưa có suất chiếu nào trong tương lai.
              </p>
            </div>
          ) : (
            groupedDataArray.map((movieGroup) => {
              const movieId = movieGroup.movieInfo.id;
              const isExpanded = expandedMovies[movieId];

              // Đếm tổng số suất chiếu của phim này
              let totalTimesForMovie = 0;
              Object.values(movieGroup.cinemas).forEach((c) => {
                Object.values(c.rooms).forEach((r) => {
                  totalTimesForMovie += r.times.length;
                });
              });

              return (
                <div
                  key={movieId}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                >
                  {/* THANH TIÊU ĐỀ CỦA PHIM (Click để đóng/mở) */}
                  <button
                    onClick={() => toggleMovieAccordion(movieId)}
                    className="w-full flex items-center justify-between p-5 bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center font-bold">
                        🎬
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-lg">
                          {movieGroup.movieInfo.title}
                        </h3>
                        <p className="text-xs text-slate-300">
                          Thời lượng: {movieGroup.movieInfo.duration} phút
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {totalTimesForMovie} suất chiếu
                      </span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </button>

                  {/* NỘI DUNG BÊN TRONG KHI MỞ RỘNG (Gồm Rạp -> Phòng -> Giờ) */}
                  {isExpanded && (
                    <div className="p-6 space-y-8 bg-slate-50">
                      {Object.values(movieGroup.cinemas).map((cinemaGroup) => (
                        <div
                          key={cinemaGroup.cinemaInfo.id}
                          className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm"
                        >
                          {/* Tên Rạp */}
                          <h4 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <span className="text-blue-600">📍</span>{" "}
                            {cinemaGroup.cinemaInfo.name}
                          </h4>

                          {/* Danh sách Phòng trong Rạp */}
                          <div className="space-y-6">
                            {Object.values(cinemaGroup.rooms).map(
                              (roomGroup) => (
                                <div
                                  key={roomGroup.roomInfo.id}
                                  className="flex flex-col md:flex-row md:items-start gap-4"
                                >
                                  {/* Tên Phòng */}
                                  <div className="md:w-1/4 shrink-0 pt-1">
                                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200">
                                      🚪 {roomGroup.roomInfo.name}
                                    </span>
                                  </div>

                                  {/* Các Cục Giờ Chiếu */}
                                  <div className="md:w-3/4 flex flex-wrap gap-3">
                                    {roomGroup.times.map((st) => (
                                      <div
                                        key={st.id}
                                        className="group relative flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-md transition-all"
                                      >
                                        {/* Thông tin giờ và giá */}
                                        <div className="px-3 py-2 flex flex-col">
                                          <span className="font-bold text-slate-700">
                                            {new Date(
                                              st.startTime,
                                            ).toLocaleString("vi-VN", {
                                              dateStyle: "short",
                                              timeStyle: "short",
                                            })}
                                          </span>
                                          <span className="text-[11px] text-slate-500 font-medium">
                                            {Number(st.price).toLocaleString()}{" "}
                                            đ
                                          </span>
                                        </div>

                                        {/* Nút Xóa (Dấu X đỏ) */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(st.id);
                                          }}
                                          className="h-full px-2 bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white border-l border-slate-200 transition-colors flex items-center justify-center"
                                          title="Xóa suất này"
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
                                              d="M6 18L18 6M6 6l12 12"
                                            ></path>
                                          </svg>
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminShowtimePage;
