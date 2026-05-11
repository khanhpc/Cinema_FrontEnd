import React, { useEffect, useState } from "react";
import api from "../../service/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2"; // Import thêm Swal để làm hộp thoại xịn

const AdminComboBongNuoc = () => {
  const [comboBongNuoc, setComboBongNuoc] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    fetchComboBongNuoc();
  }, []);

  const fetchComboBongNuoc = async () => {
    try {
      const response = await api.get(`/admin/combo-bongnuoc`);
      setComboBongNuoc(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateComboBongNuoc = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/combo-bongnuoc/create`, form);
      toast.success("Đã thêm combo ngon lành bác nhé!", {
        style: { background: "#18181b", color: "#fff", borderRadius: "10px" },
      });
      fetchComboBongNuoc();
      setForm({ name: "", description: "", price: "" });
    } catch (error) {
      console.error(error);
      toast.error("Không thêm được rồi bác ơi!");
    }
  };

  const handleDeleteComboBongNuoc = (id) => {
    // Thay thế window.confirm bằng Swal xịn xò
    Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bác có chắc muốn bỏ combo này khỏi thực đơn không?",
      icon: "warning",
      background: "#18181b",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // Màu đỏ Rose
      cancelButtonColor: "#27272a", // Màu xám Zinc
      confirmButtonText: "Đúng, xóa nó!",
      cancelButtonText: "Hủy",
      customClass: {
        popup: "rounded-[30px] border border-zinc-800 shadow-2xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`admin/combo-bongnuoc/delete/${id}`);
          toast.success("Đã xóa xong bác nhé!", {
            style: {
              background: "#18181b",
              color: "#fff",
              borderRadius: "10px",
            },
          });
          fetchComboBongNuoc();
        } catch (error) {
          console.error(error);
          toast.error("Lỗi khi xóa rồi bác!");
        }
      }
    });
  };

  return (
    <div className="h-full min-h-screen bg-transparent p-4 lg:p-8 font-sans text-zinc-300 pb-32 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* ================= CỘT TRÁI: FORM TẠO COMBO ================= */}
        <div className="lg:w-[380px] shrink-0">
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[35px] border border-zinc-800 shadow-2xl sticky top-8 overflow-hidden">
            <div className="p-8 border-b border-zinc-800/50 bg-gradient-to-br from-amber-500/10 to-transparent">
              <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                <div className="p-2 bg-amber-500 rounded-lg shadow-lg shadow-amber-500/20">
                  <span className="text-xl">🍿</span>
                </div>
                Tạo Combo Mới
              </h2>
              <p className="text-[11px] text-zinc-500 mt-2 font-bold uppercase tracking-widest opacity-60">
                Thêm đồ ăn nhẹ vào menu
              </p>
            </div>

            <form
              onSubmit={handleCreateComboBongNuoc}
              className="p-8 space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Tên Combo
                </label>
                <input
                  type="text"
                  placeholder="VD: Combo 169K"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Mô Tả Chi Tiết
                </label>
                <textarea
                  placeholder="VD: 1 Bắp lớn + 2 Nước ngọt..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows="3"
                  className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all resize-none"
                  required
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Giá bán (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="169000"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold">
                    đ
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-2xl transition-all duration-300 shadow-xl shadow-amber-500/20 active:scale-[0.97] uppercase tracking-widest text-sm flex items-center justify-center gap-3 mt-4"
              >
                XÁC NHẬN THÊM COMBO
              </button>
            </form>
          </div>
        </div>

        {/* ================= CỘT PHẢI: DANH SÁCH COMBO ================= */}
        <div className="flex-1 min-w-0">
          <div className="bg-zinc-900/30 backdrop-blur-md rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  Menu Bắp & Nước
                </h2>
              </div>
              <span className="bg-zinc-800 text-amber-500 px-4 py-1.5 rounded-full text-[11px] font-black uppercase border border-zinc-700">
                {comboBongNuoc?.length || 0} Sản phẩm
              </span>
            </div>

            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em]">
                    <th className="px-8 py-5">Sản phẩm</th>
                    <th className="px-8 py-5">Mô tả chi tiết</th>
                    <th className="px-8 py-5 text-right">Giá niêm yết</th>
                    <th className="px-8 py-5 text-center">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800/50">
                  {!comboBongNuoc || comboBongNuoc.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-24">
                        <div className="flex flex-col items-center justify-center text-zinc-600 opacity-40">
                          <span className="text-7xl mb-4 grayscale">🥤</span>
                          <p className="text-lg font-bold uppercase tracking-widest">
                            Chưa có combo nào bác ơi
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    comboBongNuoc.map((c, index) => (
                      <tr
                        key={c.id || index}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                              🍿
                            </div>
                            <span className="font-black text-white text-base uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p
                            className="text-zinc-400 font-medium text-sm italic line-clamp-2 max-w-xs"
                            title={c.description}
                          >
                            {c.description}
                          </p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-2 rounded-xl text-sm font-black tracking-tighter">
                            {Number(c.price).toLocaleString("vi-VN")} VNĐ
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button
                            onClick={() => handleDeleteComboBongNuoc(c.id)}
                            className="text-zinc-600 hover:text-white hover:bg-rose-600 p-3 rounded-2xl transition-all duration-300 shadow-sm active:scale-90"
                            title="Xóa combo"
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
        
        .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #e11d48; }
      `}</style>
    </div>
  );
};

export default AdminComboBongNuoc;
