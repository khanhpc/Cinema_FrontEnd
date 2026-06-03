import React, { useEffect, useState } from "react";
import api from "../../service/api";
import toast from "react-hot-toast";
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
    }
  };

  const fetchCinemas = async () => {
    try {
      const response = await api.get(`/admin/cinemas`);
      setCinemas(response.data);
    } catch (error) {
      console.error(error);
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
        title: "Thành công!",
        text: "Bác đã tạo phòng và cấu hình sơ đồ ghế xong xuôi nhé!",
        icon: "success",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#e11d48",
      });

      setForm({ name: "", cinemaId: "", rows: "", perRow: "" });
      fetchRooms();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra rồi bác ơi!");
    }
  };

  const handleDeleteRoom = (id) => {
    Swal.fire({
      title: "Xác nhận xóa phòng?",
      text: "Xóa phòng là mất luôn cả sơ đồ ghế đó bác, bác chắc chưa?",
      icon: "warning",
      showCancelButton: true,
      background: "#18181b",
      color: "#fff",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Đúng, xóa luôn!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`admin/rooms/delete/${id}`);
          toast.success("Đã tiễn phòng này lên đường!");
          fetchRooms();
        } catch (error) {
          console.error(error);
          toast.error("Không xóa được bác ạ!");
        }
      }
    });
  };

  return (
    <div className="h-full bg-transparent p-4 lg:p-8 font-sans text-zinc-300 pb-32 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* ================= CỘT TRÁI: FORM TẠO PHÒNG (UI PREMIUM) ================= */}
        <div className="lg:w-[380px] shrink-0">
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[35px] border border-zinc-800 shadow-2xl sticky top-8 overflow-hidden">
            <div className="p-8 border-b border-zinc-800/50 bg-gradient-to-br from-rose-500/10 to-transparent">
              <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                <div className="p-2 bg-rose-600 rounded-lg shadow-lg shadow-rose-600/20">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                Thiết Kế Phòng
              </h2>
              <p className="text-[11px] text-zinc-500 mt-2 font-bold uppercase tracking-widest opacity-60">
                Xây dựng không gian trải nghiệm
              </p>
            </div>

            <form onSubmit={handleCreateRoom} className="p-8 space-y-6">
              {/* Tên Phòng */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Tên Phòng
                </label>
                <input
                  type="text"
                  placeholder="VD: IMAX - Phòng 01"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all"
                  required
                />
              </div>

              {/* Chọn Rạp */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Rạp Trực Thuộc
                </label>
                <select
                  className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white outline-none focus:border-rose-500 transition-all cursor-pointer appearance-none"
                  value={form.cinemaId || ""}
                  onChange={(e) =>
                    setForm({ ...form, cinemaId: e.target.value })
                  }
                  required
                >
                  <option value="" disabled className="bg-zinc-900">
                    -- Chọn rạp chiếu --
                  </option>
                  {cinemas.map((c) => (
                    <option key={c.id} value={c.id} className="bg-zinc-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cấu hình ghế (Box riêng biệt cho chuyên nghiệp) */}
              <div className="p-5 bg-zinc-950/50 border border-zinc-800 rounded-3xl space-y-5">
                <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2">
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
                    />
                  </svg>
                  Sơ đồ ghế ngồi
                </h3>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-bold ml-1">
                      Số hàng
                    </label>
                    <input
                      type="number"
                      placeholder="1-20"
                      value={form.rows || ""}
                      onChange={(e) =>
                        setForm({ ...form, rows: e.target.value })
                      }
                      className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-center focus:border-rose-500 outline-none transition-all"
                      required
                      min="1"
                      max="26"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-bold ml-1">
                      Ghế/Hàng
                    </label>
                    <input
                      type="number"
                      placeholder="1-20"
                      value={form.perRow || ""}
                      onChange={(e) =>
                        setForm({ ...form, perRow: e.target.value })
                      }
                      className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-center focus:border-rose-500 outline-none transition-all"
                      required
                      min="1"
                    />
                  </div>
                </div>

                {form.rows && form.perRow && (
                  <div className="text-center py-2 bg-rose-500/5 rounded-xl border border-rose-500/10">
                    <p className="text-[10px] text-zinc-400 font-bold">
                      Sức chứa:{" "}
                      <span className="text-rose-500 text-sm">
                        {form.rows * form.perRow}
                      </span>{" "}
                      ghế
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all duration-300 shadow-xl shadow-rose-600/20 active:scale-[0.97] uppercase tracking-widest text-sm"
              >
                KHỞI TẠO PHÒNG CHIẾU
              </button>
            </form>
          </div>
        </div>

        {/* ================= CỘT PHẢI: DANH SÁCH PHÒNG (UI MODERN TABLE) ================= */}
        <div className="flex-1 min-w-0">
          <div className="bg-zinc-900/30 backdrop-blur-md rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl">
            {/* Header Bảng */}
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-rose-600 rounded-full"></div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  Hệ thống phòng chiếu
                </h2>
              </div>
              <span className="bg-zinc-800 text-rose-500 px-4 py-1.5 rounded-full text-[11px] font-black uppercase border border-zinc-700">
                {filteredRooms?.length || 0} phòng đang hoạt động
              </span>
            </div>

            {/* Thanh Tab Rạp (Thiết kế lại cực đẹp) */}
            {cinemas.length > 0 && (
              <div className="px-8 pt-6 pb-2 border-b border-zinc-800/50 overflow-x-auto custom-scroll flex gap-3">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap border-2
                      ${
                        activeTab === "all"
                          ? "bg-white border-white text-zinc-950 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                      }`}
                >
                  Tất cả rạp
                </button>
                {cinemas.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveTab(c.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap border-2
                        ${
                          activeTab === c.id
                            ? "bg-rose-600 border-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]"
                            : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                        }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em]">
                    <th className="px-8 py-6">Phòng Chiếu</th>
                    <th className="px-8 py-6">Vị trí Rạp</th>
                    <th className="px-8 py-6 text-center">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800/50">
                  {!filteredRooms || filteredRooms.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-24">
                        <div className="flex flex-col items-center justify-center text-zinc-600 opacity-40">
                          <span className="text-7xl mb-4">🚪</span>
                          <p className="text-lg font-bold uppercase tracking-widest">
                            Không có phòng nào bác ơi
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRooms.map((r, index) => (
                      <tr
                        key={r.id || index}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-black text-zinc-500 group-hover:border-rose-500 group-hover:text-rose-500 transition-all">
                              {index + 1}
                            </div>
                            <span className="font-black text-white text-base uppercase tracking-tight group-hover:text-rose-500 transition-colors">
                              {r.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="bg-zinc-800 text-zinc-400 px-4 py-1.5 rounded-lg text-[11px] font-black border border-zinc-700 uppercase tracking-widest">
                            {r.cinema.name}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button
                            onClick={() => handleDeleteRoom(r.id)}
                            className="text-zinc-600 hover:text-white hover:bg-rose-600 p-3 rounded-2xl transition-all duration-300 shadow-sm active:scale-90"
                            title="Xóa phòng này"
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
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        
        .custom-scroll::-webkit-scrollbar { width: 4px; height: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #e11d48; }
      `}</style>
    </div>
  );
};

export default AdminRoomPage;
