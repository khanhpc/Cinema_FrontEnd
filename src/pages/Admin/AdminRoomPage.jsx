import React, { useEffect, useState } from "react";
import api from "../../service/api";
import { data } from "react-router-dom";
import Swal from "sweetalert2";

const AdminRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    name: "",
    cinemaId: "",
    rows: "",
    perRow: "",
  });
  const [cinemas, setCinemas] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchRooms();
    fetchCinemas();
  }, []);

  const filteredRooms =
    activeTab === "all"
      ? rooms
      : rooms.filter((r) => r.cinema.id === activeTab);

  const fetchRooms = async () => {
    try {
      const response = await api.get(`/admin/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Lỗi rồi");
    }
  };

  const fetchCinemas = async () => {
    try {
      const response = await api.get(`/admin/cinemas`);
      setCinemas(response.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Lỗi rồi");
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const roomPayload = {
        name: form.name,
        cinemaId: form.cinemaId,
      };

      const roomResponse = await api.post(`/admin/rooms/create`, roomPayload);

      const newRoomId = roomResponse.data.id;

      const seatPayload = {
        roomId: newRoomId,
        rows: parseInt(form.rows),
        perRow: parseInt(form.perRow),
      };

      await api.post(`/admin/seats/generate`, seatPayload);

      Swal.fire({
              title: 'Success',
              text: "Tạo phòng và cấu hình sơ đồ ghế thành công!",
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK',
            })
      setForm({ name: "", cinemaId: "", rows: "", perRow: "" });
      fetchRooms();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra: " + (error.response?.data || error.message));
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Bác có chắc muốn xóa room này khỏi rạp không?")) {
      try {
        await api.delete(`admin/rooms/delete/${id}`);
        alert("Xóa room thành công")
        fetchRooms();
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 md:p-8 font-sans text-slate-800 pb-20">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* ================= CỘT TRÁI: FORM TẠO PHÒNG (Giữ nguyên) ================= */}
        <div className="lg:w-1/3 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
            <div className="p-6 border-b border-slate-200 bg-blue-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
                Tạo Phòng Chiếu
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Thêm phòng chiếu mới vào rạp
              </p>
            </div>

            <form onSubmit={handleCreateRoom} className="p-6 space-y-5">
              {/* Tên Phòng */}
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5">
                  Tên Phòng
                </label>
                <input
                  type="text"
                  placeholder="VD: Phòng 1, Phòng IMAX..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-slate-700"
                  required
                />
              </div>

              {/* Thuộc Rạp Nào (Dropdown) */}
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5">
                  Thuộc Rạp Chiếu
                </label>
                <select
                  className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 text-slate-700 hover:border-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
                  value={form.cinemaId || ""}
                  onChange={(e) =>
                    setForm({ ...form, cinemaId: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    -- Chọn rạp --
                  </option>
                  {cinemas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* KHU VỰC TẠO SƠ ĐỒ GHẾ (THÊM MỚI) */}
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    ></path>
                  </svg>
                  Cấu hình sơ đồ ghế
                </h3>

                <div className="flex gap-4">
                  {/* Cột 1: Số hàng */}
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Số hàng (A, B, C...)
                    </label>
                    <input
                      type="number"
                      placeholder="VD: 10"
                      value={form.rows || ""}
                      onChange={(e) =>
                        setForm({ ...form, rows: e.target.value })
                      }
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                      required
                      min="1"
                      max="26" // Giới hạn bảng chữ cái tiếng Anh từ A-Z
                    />
                  </div>

                  {/* Cột 2: Ghế mỗi hàng */}
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Số ghế mỗi hàng
                    </label>
                    <input
                      type="number"
                      placeholder="VD: 12"
                      value={form.perRow || ""}
                      onChange={(e) =>
                        setForm({ ...form, perRow: e.target.value })
                      }
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                      required
                      min="1"
                    />
                  </div>
                </div>

                {/* Gợi ý tổng số ghế */}
                {form.rows && form.perRow && (
                  <p className="text-xs text-slate-500 font-medium">
                    👉 Tổng sức chứa:{" "}
                    <span className="font-bold text-blue-600">
                      {form.rows * form.perRow}
                    </span>{" "}
                    ghế
                  </p>
                )}
              </div>

              {/* Nút Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
              >
                <span>Lưu phòng & Tạo sơ đồ ghế</span>
              </button>
            </form>
          </div>
        </div>

        {/* ================= CỘT PHẢI: DANH SÁCH PHÒNG (CÓ TABS CHIA RẠP) ================= */}
        <div className="lg:w-2/3 flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header Bảng */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                🚪 Danh sách Phòng chiếu
              </h2>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                {filteredRooms ? filteredRooms.length : 0} phòng
              </span>
            </div>

            {/* ================= THANH TABS NGANG Ở ĐÂY ================= */}
            {cinemas.length > 0 && (
              <div className="px-6 pt-4 pb-0 bg-slate-50/50 border-b border-slate-200">
                <div className="flex gap-2 overflow-x-auto pb-3 snap-x">
                  {/* Tab "Tất cả" */}
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 snap-start ${
                      activeTab === "all"
                        ? "bg-slate-800 text-white shadow-md shadow-slate-500/20 -translate-y-0.5"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    Tất cả phòng
                  </button>

                  {/* Lặp qua danh sách rạp để tạo Tabs */}
                  {cinemas.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveTab(c.id)}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 snap-start ${
                        activeTab === c.id
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 -translate-y-0.5"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nội dung bảng (Dùng biến filteredRooms thay vì rooms) */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Tên Phòng</th>
                    <th className="px-6 py-4">Thuộc Rạp</th>
                    <th className="px-6 py-4 text-center">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {!filteredRooms || filteredRooms.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-16">
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
                              d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                            ></path>
                          </svg>
                          <p className="text-base font-medium text-slate-500">
                            {activeTab === "all"
                              ? "Chưa có phòng chiếu nào"
                              : "Rạp này chưa có phòng nào"}
                          </p>
                          <p className="text-sm mt-1">
                            Hãy sử dụng form bên cạnh để thêm phòng chiếu mới.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRooms.map((r, index) => (
                      <tr
                        key={r.id || index}
                        className="hover:bg-slate-50/80 transition duration-150 group"
                      >
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {r.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold">
                            {r.cinema.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDeleteRoom(r.id)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                            title="Xóa phòng"
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
    </div>
  );
};

export default AdminRoomPage;
