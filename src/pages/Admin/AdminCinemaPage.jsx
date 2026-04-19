import React, { useEffect, useState } from "react";
import api from "../../service/api";

const AdminCinemaPage = () => {
  const [form, setForm] = useState({ name: "", location: "" });
  const [cinemas, setCinemas] = useState([]);

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

  const handCreateCinema = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/cinemas/create`, form);
      alert("tạo rạp thành công");
      setForm({
        name: "",
        location: "",
      });
      fetchCinemas();
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Lỗi rồi bác ơi!");
    }
  };

  const handleDeleteCinema = async (id) => {
    if (window.confirm("Bác có chắc muốn xóa Cinema này không?")) {
      try {
        await api.delete(`admin/cinemas/delete/${id}`);
        alert("Xóa Cinema thành công");
        fetchCinemas();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 md:p-8 font-sans text-slate-800 pb-20">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* ================= CỘT TRÁI: FORM TẠO RẠP ================= */}
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
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                Tạo Rạp Mới
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Thêm cụm rạp vào hệ thống
              </p>
            </div>

            <form onSubmit={handCreateCinema} className="p-6 space-y-5">
              {/* Tên rạp */}
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5">
                  Tên Rạp
                </label>
                <input
                  type="text"
                  placeholder="VD: Cinemax Hà Nội"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-slate-700"
                  required
                />
              </div>

              {/* Địa chỉ rạp */}
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5">
                  Địa điểm / Khu vực
                </label>
                <input
                  type="text"
                  placeholder="VD: Tầng 5 Vincom Bà Triệu"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-slate-700"
                  required
                />
              </div>

              {/* Nút Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
              >
                <span>Thêm Rạp</span>
              </button>
            </form>
          </div>
        </div>

        {/* ================= CỘT PHẢI: DANH SÁCH RẠP ================= */}
        <div className="lg:w-2/3 flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                📋 Danh sách Rạp chiếu
              </h2>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                {cinemas.length} rạp
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                {/* Đã sửa lại cấu trúc thead > tr > th */}
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Tên Rạp</th>
                    <th className="px-6 py-4">Địa Chỉ</th>
                    <th className="px-6 py-4 text-center">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {cinemas.length === 0 ? (
                    <tr>
                      {/* colSpan="3" để chiếm trọn chiều ngang của bảng */}
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
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            ></path>
                          </svg>
                          <p className="text-base font-medium text-slate-500">
                            Hệ thống chưa có rạp nào
                          </p>
                          <p className="text-sm mt-1">
                            Hãy sử dụng form bên cạnh để thêm rạp mới.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Đã sửa lại lỗi arrow function không có return
                    cinemas.map((c, index) => (
                      <tr
                        key={c.id || index}
                        className="hover:bg-slate-50/80 transition duration-150 group"
                      >
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {c.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {c.location}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDeleteCinema(c.id)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                            title="Xóa rạp"
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

export default AdminCinemaPage;
