import React, { useEffect, useState } from "react";
import api from "../../service/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { PlusCircle, Sliders, RotateCcw, Edit2, Trash2 } from "lucide-react";

const AdminCinemaPage = () => {
  const [form, setForm] = useState({ name: "", location: "" });
  const [cinemas, setCinemas] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      const response = await api.get(`admin/cinemas`);
      setCinemas(response.data);
    } catch (error) {
      console.log(error.data);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/cinemas/update/${editingId}`, form);
        toast.success("Cập nhật thông tin rạp thành công!", {
          style: { background: "#18181b", color: "#fff", borderRadius: "10px" },
        });
      } else {
        await api.post(`/admin/cinemas/create`, form);
        toast.success("Tạo rạp mới thành công bác nhé!", {
          style: { background: "#18181b", color: "#fff", borderRadius: "10px" },
        });
      }
      handleCancelEdit();
      fetchCinemas();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Lỗi rồi bác ơi!",
        text:
          error.response?.data ||
          "Không thể thực hiện tác vụ, bác kiểm tra lại nhé.",
        icon: "error",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#e11d48",
      });
    }
  };

  const handleStartEdit = (cinema) => {
    setEditingId(cinema.id);
    setForm({ name: cinema.name, location: cinema.location });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", location: "" });
  };

  const handleDeleteCinema = (id) => {
    Swal.fire({
      title: "Xác nhận xóa rạp?",
      text: "Bác chắc chắn muốn gỡ rạp này khỏi hệ thống chứ?",
      icon: "warning",
      showCancelButton: true,
      background: "#18181b",
      color: "#fff",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#27272a",
      confirmButtonText: "Đúng, xóa luôn!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`admin/cinemas/delete/${id}`);
          toast.success("Đã xóa rạp thành công!", {
            style: {
              background: "#18181b",
              color: "#fff",
              borderRadius: "10px",
            },
          });
          if (editingId === id) handleCancelEdit();
          fetchCinemas();
        } catch (error) {
          console.error(error);
          toast.error("Lỗi khi xóa rạp rồi bác!");
        }
      }
    });
  };

  return (
    <div className="h-full min-h-screen bg-transparent p-4 lg:p-8 font-sans text-zinc-300 pb-32 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        <div className="lg:w-[350px] shrink-0">
          <div
            className={`backdrop-blur-xl rounded-[35px] border shadow-2xl sticky top-8 overflow-hidden transition-all duration-500 ${
              editingId
                ? "bg-rose-500/5 border-rose-500/30"
                : "bg-zinc-900/40 border-zinc-800"
            }`}
          >
            <div
              className={`p-8 border-b ${editingId ? "border-rose-500/20 bg-rose-500/5" : "border-zinc-800/50"}`}
            >
              <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                <div
                  className={`p-2 rounded-lg shadow-lg transition-colors ${
                    editingId
                      ? "bg-rose-600 text-white shadow-rose-600/20"
                      : "bg-zinc-800 text-rose-500"
                  }`}
                >
                  {editingId ? <Sliders size={20} /> : <PlusCircle size={20} />}
                </div>
                {editingId ? "Cập Nhật Cụm Rạp" : "Tạo Rạp Mới"}
              </h2>
              <p className="text-[10px] text-zinc-500 mt-2 font-black uppercase tracking-widest opacity-80">
                {editingId
                  ? "Thay đổi thông tin hệ thống rạp"
                  : "Thêm cụm rạp vào hệ thống"}
              </p>
            </div>

            <form onSubmit={handleSubmitForm} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Tên Cụm Rạp
                </label>
                <input
                  type="text"
                  placeholder="VD: Cinema Plus Hà Nội"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Địa điểm / Khu vực
                </label>
                <input
                  type="text"
                  placeholder="VD: Tầng 5 Vincom Bà Triệu"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all duration-300 shadow-xl shadow-rose-600/10 active:scale-[0.97] uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                >
                  {editingId ? "Lưu Thay Đổi" : "Xác Nhận Thêm Rạp"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full h-14 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-black rounded-2xl transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2 border border-white/5"
                  >
                    <RotateCcw size={14} /> Hủy Sửa
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-zinc-900/30 backdrop-blur-md rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-rose-600 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.4)]"></div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  Danh sách rạp chiếu
                </h2>
              </div>
              <span className="bg-zinc-800 text-rose-500 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border border-zinc-700">
                {cinemas.length} rạp toàn quốc
              </span>
            </div>

            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em] border-b border-zinc-900">
                    <th className="px-8 py-5 w-16">#</th>
                    <th className="px-8 py-5">Thông Tin Cụm Rạp</th>
                    <th className="px-8 py-5 text-center w-32">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800/40">
                  {cinemas.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-24">
                        <div className="flex flex-col items-center justify-center text-zinc-600 opacity-30">
                          <svg
                            className="w-16 h-16 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <p className="text-sm font-black uppercase tracking-widest">
                            Hệ thống chưa có dữ liệu rạp
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    cinemas.map((c, index) => (
                      <tr
                        key={c.id || index}
                        className={`transition-colors group ${editingId === c.id ? "bg-rose-500/5 animate-pulse" : "hover:bg-white/[0.02]"}`}
                      >
                        <td className="px-8 py-6 text-zinc-600 font-bold text-xs">
                          {index + 1}
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1.5 min-w-0">
                            <span className="block font-black text-white text-base uppercase tracking-tight group-hover:text-rose-500 transition-colors">
                              {c.name}
                            </span>
                            <p className="text-zinc-500 font-bold text-xs italic leading-relaxed break-words">
                              {c.location}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleStartEdit(c)}
                              className={`p-3 rounded-xl transition-all duration-200 active:scale-90 ${
                                editingId === c.id
                                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20"
                                  : "text-zinc-600 hover:text-white hover:bg-zinc-800"
                              }`}
                              title="Sửa thông tin"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCinema(c.id)}
                              className="text-zinc-600 hover:text-white hover:bg-rose-600 p-3 rounded-xl transition-all duration-200 active:scale-90"
                              title="Xóa cụm rạp"
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
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #e11d48; }
      `}</style>
    </div>
  );
};

export default AdminCinemaPage;
