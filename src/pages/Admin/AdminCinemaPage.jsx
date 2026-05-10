import React, { useEffect, useState } from "react";
import api from "../../service/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2"; // Bác nhớ cài/import cái này nhé

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
      toast.success("Tạo rạp mới thành công bác nhé!", {
        style: { background: "#18181b", color: "#fff", borderRadius: "10px" },
      });
      setForm({ name: "", location: "" });
      fetchCinemas();
    } catch (error) {
      console.error(error);
      // THAY THẾ ALERT BẰNG SWAL
      Swal.fire({
        title: "Lỗi rồi bác ơi!",
        text:
          error.response?.data ||
          "Không tạo được rạp, bác kiểm tra lại thông tin nhé.",
        icon: "error",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#e11d48",
      });
    }
  };

  const handleDeleteCinema = (id) => {
    // THAY THẾ CONFIRM BẰNG SWAL XỊN
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
        {/* ================= CỘT TRÁI: FORM TẠO RẠP ================= */}
        <div className="lg:w-[350px] shrink-0">
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
                Tạo Rạp Mới
              </h2>
              <p className="text-[11px] text-zinc-500 mt-2 font-bold uppercase tracking-widest opacity-60">
                Thêm cụm rạp vào hệ thống
              </p>
            </div>

            <form onSubmit={handCreateCinema} className="p-8 space-y-6">
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

              <button
                type="submit"
                className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all duration-300 shadow-xl shadow-rose-600/20 active:scale-[0.97] uppercase tracking-widest text-sm flex items-center justify-center gap-3 mt-4"
              >
                XÁC NHẬN THÊM RẠP
              </button>
            </form>
          </div>
        </div>

        {/* ================= CỘT PHẢI: DANH SÁCH RẠP ================= */}
        <div className="flex-1 min-w-0">
          <div className="bg-zinc-900/30 backdrop-blur-md rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-rose-600 rounded-full"></div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  Danh sách rạp chiếu
                </h2>
              </div>
              <span className="bg-zinc-800 text-rose-500 px-4 py-1.5 rounded-full text-[11px] font-black uppercase border border-zinc-700">
                {cinemas.length} rạp trên toàn quốc
              </span>
            </div>

            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em]">
                    <th className="px-8 py-5">#</th>
                    <th className="px-8 py-5">Tên Cụm Rạp</th>
                    <th className="px-8 py-5">Địa Chỉ Chi Tiết</th>
                    <th className="px-8 py-5 text-center">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800/50">
                  {cinemas.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-24">
                        <div className="flex flex-col items-center justify-center text-zinc-600 opacity-40">
                          <svg
                            className="w-20 h-20 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <p className="text-lg font-bold uppercase tracking-widest">
                            Hệ thống chưa có dữ liệu rạp
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    cinemas.map((c, index) => (
                      <tr
                        key={c.id || index}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-8 py-6 text-zinc-600 font-bold text-xs">
                          {index + 1}
                        </td>
                        <td className="px-8 py-6 font-black text-white text-base group-hover:text-rose-500 transition-colors uppercase tracking-tight">
                          {c.name}
                        </td>
                        <td className="px-8 py-6 text-zinc-400 font-medium text-sm italic">
                          {c.location}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button
                            onClick={() => handleDeleteCinema(c.id)}
                            className="text-zinc-600 hover:text-white hover:bg-rose-600 p-3 rounded-2xl transition-all duration-300 shadow-sm active:scale-90"
                            title="Xóa rạp này"
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

export default AdminCinemaPage;
