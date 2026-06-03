import React, { useState, useEffect } from "react";
import api from "../../service/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Edit2, Trash2, PlusCircle, RotateCcw, Sliders } from "lucide-react";

const AdminComboBongNuoc = () => {
  const [comboBongNuoc, setComboBongNuoc] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchComboBongNuoc();
  }, []);

  const fetchComboBongNuoc = async () => {
    try {
      const response = await api.get(`/admin/combo-bongnuoc`);
      setComboBongNuoc(response.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách bắp nước:", error);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/combo-bongnuoc/update/${editingId}`, form);
        toast.success("Đã cập nhật thay đổi combo thành công!", {
          style: { background: "#18181b", color: "#fff", borderRadius: "10px" },
        });
      } else {
        await api.post(`/admin/combo-bongnuoc/create`, form);
        toast.success("Đã thêm combo ngon lành bác nhé!", {
          style: { background: "#18181b", color: "#fff", borderRadius: "10px" },
        });
      }
      
      handleCancelEdit();
      fetchComboBongNuoc();
    } catch (error) {
      console.error(error);
      toast.error(editingId ? "Cập nhật thất bại rồi bác ơi!" : "Không thêm được rồi bác ơi!");
    }
  };

  const handleStartEdit = (combo) => {
    setEditingId(combo.id);
    setForm({
      name: combo.name,
      description: combo.description,
      price: combo.price,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", description: "", price: "" });
  };

  const handleDeleteComboBongNuoc = (id) => {
    Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bác có chắc muốn bỏ combo này khỏi thực đơn không?",
      icon: "warning",
      background: "#18181b",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#27272a",
      confirmButtonText: "Đúng, xóa nó!",
      cancelButtonText: "Hủy",
      customClass: { popup: "rounded-[30px] border border-zinc-800 shadow-2xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`admin/combo-bongnuoc/delete/${id}`);
          toast.success("Đã xóa xong bác nhé!", {
            style: { background: "#18181b", color: "#fff", borderRadius: "10px" },
          });
          if (editingId === id) handleCancelEdit(); // Nếu đang sửa đúng cái bị xóa thì reset form
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
        
        {/* ================= CỘT TRÁI: FORM ĐA NĂNG (TẠO / CẬP NHẬT) ================= */}
        <div className="lg:w-[380px] shrink-0">
          <div className={`backdrop-blur-xl rounded-[35px] border shadow-2xl sticky top-8 overflow-hidden transition-all duration-500 ${
            editingId ? "bg-amber-500/5 border-amber-500/30" : "bg-zinc-900/40 border-zinc-800"
          }`}>
            {/* TIÊU ĐỀ KHUNG TỰ ĐỘNG THAY ĐỔI THEO TRẠNG THÁI */}
            <div className={`p-8 border-b bg-gradient-to-br from-transparent to-transparent ${
              editingId ? "border-amber-500/20 bg-amber-500/5" : "border-zinc-800/50 bg-amber-500/5"
            }`}>
              <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                <div className={`p-2 rounded-lg shadow-lg transition-colors ${
                  editingId ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-zinc-800 text-amber-500"
                }`}>
                  {editingId ? <Sliders size={20} /> : <PlusCircle size={20} />}
                </div>
                {editingId ? "Cập Nhật Combo" : "Tạo Combo Mới"}
              </h2>
              <p className="text-[10px] text-zinc-500 mt-2 font-black uppercase tracking-widest opacity-80">
                {editingId ? "Thay đổi thông tin thực đơn" : "Thêm đồ ăn nhẹ vào menu"}
              </p>
            </div>

            <form onSubmit={handleSubmitForm} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Tên Combo
                </label>
                <input
                  type="text"
                  placeholder="VD: Combo Single 69K"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Mô Tả Chi Tiết Chi Tiết
                </label>
                <textarea
                  placeholder="VD: 1 Bắp ngọt lớn + 1 Nước Pepsi vừa..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                    placeholder="69000"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold text-sm">đ</span>
                </div>
              </div>

              {/* KHU VỰC CÁC NÚT HÀNH ĐỘNG */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  className={`w-full h-14 font-black rounded-2xl transition-all duration-300 shadow-xl uppercase text-xs tracking-widest flex items-center justify-center gap-2 ${
                    editingId 
                      ? "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/10" 
                      : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10"
                  }`}
                >
                  {editingId ? "Lưu Thay Đổi" : "Xác Nhận Thêm Combo"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full h-14 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-black rounded-2xl transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2 border border-white/5"
                  >
                    <RotateCcw size={14} /> Hủy Thay Đổi
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ================= CỘT PHẢI: DANH SÁCH MENU HIỂN THỊ THÔNG MINH ================= */}
        <div className="flex-1 min-w-0">
          <div className="bg-zinc-900/30 backdrop-blur-md rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)]"></div>
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
                  <tr className="bg-zinc-950/50 text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em] border-b border-zinc-900">
                    <th className="px-8 py-5">Chi tiết sản phẩm</th>
                    <th className="px-8 py-5 text-right">Giá bán niêm yết</th>
                    <th className="px-8 py-5 text-center">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800/40">
                  {!comboBongNuoc || comboBongNuoc.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-24">
                        <div className="flex flex-col items-center justify-center text-zinc-600 opacity-30">
                          <span className="text-7xl mb-4">🍿</span>
                          <p className="text-sm font-black uppercase tracking-widest">Chưa có dữ liệu bắp nước</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    comboBongNuoc.map((c, index) => (
                      <tr
                        key={c.id || index}
                        className={`transition-colors group ${
                          editingId === c.id ? "bg-amber-500/5 animate-pulse" : "hover:bg-white/[0.02]"
                        }`}
                      >
                        {/* GOM TÊN VÀ MÔ TẢ VÀO MỘT KHỐI GIÚP ĐỌC CỰC KỲ DỄ DÀNG */}
                        <td className="px-8 py-6 max-w-md">
                          <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-2xl group-hover:border-amber-500/30 transition-colors shrink-0">
                              🍿
                            </div>
                            <div className="space-y-1.5 min-w-0">
                              <span className="block font-black text-white text-base uppercase tracking-tight group-hover:text-amber-500 transition-colors truncate">
                                {c.name}
                              </span>
                              <p className="text-zinc-500 font-bold text-xs italic leading-relaxed break-words">
                                {c.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        {/* GIÁ TIỀN IN ĐẬM SẮC NÉT */}
                        <td className="px-8 py-6 text-right whitespace-nowrap">
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-2 rounded-xl text-sm font-black tracking-tight">
                            {Number(c.price).toLocaleString("vi-VN")} ₫
                          </span>
                        </td>
                        
                        {/* NÚT SỬA VÀ XÓA VIP */}
                        <td className="px-8 py-6 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleStartEdit(c)}
                              className={`p-3 rounded-xl transition-all duration-200 active:scale-90 ${
                                editingId === c.id 
                                  ? "text-amber-500 bg-amber-500/10 border border-amber-500/20" 
                                  : "text-zinc-600 hover:text-white hover:bg-zinc-800"
                              }`}
                              title="Sửa thông tin"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteComboBongNuoc(c.id)}
                              className="text-zinc-600 hover:text-white hover:bg-rose-600 p-3 rounded-xl transition-all duration-200 active:scale-90"
                              title="Xóa khỏi menu"
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #e11d48; }
      `}</style>
    </div>
  );
};

export default AdminComboBongNuoc;