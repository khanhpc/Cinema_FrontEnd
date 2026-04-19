import React, { useEffect, useState } from "react";
import api from "../../service/api";

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
      alert("Thêm Combo Thành Công");
      fetchComboBongNuoc();
      setForm({ name: "", description: "", price: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComboBongNuoc = async (id) => {
    if (window.confirm("Bác có chắc muốn xóa Combo này không?")) {
      try {
        await api.delete(`admin/combo-bongnuoc/delete/${id}`);
        alert("Xóa Combo thành công");
        fetchComboBongNuoc();
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 md:p-8 font-sans text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* ================= CỘT TRÁI: FORM TẠO COMBO ================= */}
        <div className="lg:w-1/3 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
            <div className="p-6 border-b border-slate-200 bg-amber-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="text-2xl">🍿</span> Tạo Combo Bắp Nước
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Thêm combo đồ ăn nhẹ mới vào hệ thống
              </p>
            </div>

            <form
              onSubmit={handleCreateComboBongNuoc}
              className="p-6 space-y-5"
            >
              {/* Tên Combo */}
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5">
                  Tên Combo
                </label>
                <input
                  type="text"
                  placeholder="VD: Combo 89K, Combo Đôi Bạn..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all text-slate-700"
                  required
                />
              </div>

              {/* Mô Tả */}
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5">
                  Mô Tả Chi Tiết
                </label>
                <textarea
                  placeholder="VD: Bao gồm 1 bắp phô mai lớn và 2 ly nước ngọt..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows="3"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all text-slate-700 resize-none"
                  required
                ></textarea>
              </div>

              {/* Giá Combo */}
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5">
                  Giá Combo (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="VD: 89000"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    min="0"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all text-slate-700 pr-12"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                    đ
                  </div>
                </div>
              </div>

              {/* Nút Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/30 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Tạo Combo Mới
              </button>
            </form>
          </div>
        </div>

        {/* ================= CỘT PHẢI: DANH SÁCH COMBO ================= */}
        <div className="lg:w-2/3 flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                🥤 Danh sách Bắp Nước
              </h2>
              <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                {/* Giả sử mảng danh sách combo của bác tên là 'combos' */}
                {comboBongNuoc ? comboBongNuoc.length : 0} combo
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Sản phẩm</th>
                    <th className="px-6 py-4">Mô tả chi tiết</th>
                    <th className="px-6 py-4 text-right">Giá bán</th>
                    <th className="px-6 py-4 text-center">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {!comboBongNuoc || comboBongNuoc.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-16">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <span className="text-5xl mb-3 opacity-50 grayscale">
                            🥤
                          </span>
                          <p className="text-base font-medium text-slate-500">
                            Chưa có combo nào
                          </p>
                          <p className="text-sm mt-1">
                            Sử dụng form bên cạnh để thêm đồ ăn nhẹ.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    comboBongNuoc.map((c, index) => (
                      <tr
                        key={c.id || index}
                        className="hover:bg-amber-50/30 transition duration-150 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-xl shrink-0">
                              🍿
                            </div>
                            <span className="font-bold text-slate-800 whitespace-nowrap">
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p
                            className="text-slate-500 text-xs line-clamp-2 max-w-xs"
                            title={c.description}
                          >
                            {c.description}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                            {Number(c.price).toLocaleString("vi-VN")} đ
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                            title="Xóa combo"
                            onClick={() => handleDeleteComboBongNuoc(c.id)}
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

export default AdminComboBongNuoc;
