import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import api from "../../service/api";
import * as XLSX from "xlsx";

const AdminStatisticsPage = () => {
  const [overview, setOverview] = useState({
    totalRevenue: 0,
    totalTickets: 0,
    totalCombos: 0,
    yearlyRevenue: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [activeTab, setActiveTab] = useState("7days");

  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const fetchStatistics = async (start, end) => {
    setLoading(true);
    setIsReady(false);
    try {
      const [overviewRes, chartRes, topRes] = await Promise.all([
        api.get(`/admin/stats/overview?start=${start}&end=${end}`),
        api.get(`/admin/stats/revenue-7-days?start=${start}&end=${end}`),
        api.get(`/admin/stats/top-movies?start=${start}&end=${end}`),
      ]);
      setOverview(overviewRes.data);
      setChartData(chartRes.data);
      setTopMovies(topRes.data);

      setTimeout(() => setIsReady(true), 200);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics(startDate, endDate);
  }, []);

  const handleFilter = () => {
    if (new Date(startDate) > new Date(endDate)) {
      alert("⚠️ Ngày không hợp lệ bác ơi!");
      return;
    }
    setActiveTab("");
    fetchStatistics(startDate, endDate);
  };

  const handleQuickFilter = (type) => {
    setActiveTab(type);
    const today = new Date();
    let start = new Date();
    let end = today;

    if (type === "today") {
      start = today;
    } else if (type === "7days") {
      start.setDate(today.getDate() - 6);
    } else if (type === "30days") {
      start.setDate(today.getDate() - 29);
    }

    const formatDateStr = (date) => date.toISOString().split("T")[0];

    const startStr = formatDateStr(start);
    const endStr = formatDateStr(end);

    setStartDate(startStr);
    setEndDate(endStr);
    fetchStatistics(startStr, endStr);
  };

  const formatFullCurrency = (v) => {
    const formatted = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v || 0);
    return formatted.replace("₫", "VND");
  };

  const handleBarClick = async (data) => {
    if (!data || !data.name) return;
    setSelectedDay(data);
    setIsModalOpen(true);
    setLoadingDetail(true);
    try {
      const dayStr = data.name.replace("Ngày ", "");
      const res = await api.get(`/admin/stats/detail?day=${dayStr}`);
      setDetailData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleExportExcel = () => {
    const formatViewDate = (dateStr) => {
      if (!dateStr) return "";
      const [y, m, d] = dateStr.split("-");
      return `${d}/${m}/${y}`;
    };

    const excelData = [
      ["BÁO CÁO DOANH THU"],
      [`Khoảng thời gian: Từ ngày ${formatViewDate(startDate)} đến ngày ${formatViewDate(endDate)}`],
      [],
      ["Tổng doanh thu kỳ này:", formatFullCurrency(overview.totalRevenue)],
      ["Tổng số vé đã bán:", `${overview.totalTickets} Vé`],
      ["Tổng bắp nước:", overview.totalCombos],
      [],
      ["Ngày/Tháng/Năm", "Doanh Thu (VND)"],
    ];

    const baseDate = new Date(startDate);

    chartData.forEach((item, index) => {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + index);

      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();

      const fullDateLabel = `${day}/${month}/${year}`;

      excelData.push([fullDateLabel, item.revenue]);
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DoanhThuChiTiet");

    XLSX.writeFile(wb, `DoanhThu_ChiTiet_${startDate}_To_${endDate}.xlsx`);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 shadow-2xl">
          <p className="text-xs font-black text-white mb-1">{label}</p>
          <p className="text-xs font-bold text-zinc-200">
            Doanh thu: <span className="text-white font-black">{formatFullCurrency(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 bg-transparent min-h-full font-sans animate-fadeIn">

      {/* HÀNG TRÊN CÙNG - ITEMS-STRETCH GIÚP HAI BÊN LUÔN BẰNG NHAU TUYỆT ĐỐI */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch gap-6">

        {/* 4 THỂ THỐNG KÊ BÊN TRÁI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:flex-1">
          {[
            {
              label: "Doanh Thu Kỳ Này",
              value: formatFullCurrency(overview.totalRevenue),
              color: "bg-blue-600",
            },
            {
              label: "Vé Đã Bán",
              value: `${overview.totalTickets} Vé`,
              color: "bg-orange-600",
            },
            {
              label: "Bỏng nước Đã Bán",
              value: `${overview.totalCombos}`,
              color: "bg-emerald-600",
            },
            {
              label: `Doanh Thu Năm ${new Date().getFullYear()}`,
              value: formatFullCurrency(overview.yearlyRevenue),
              color: "bg-purple-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-zinc-900/40 backdrop-blur-md p-5 rounded-[24px] border border-white/5 relative overflow-hidden shadow-xl transition-all duration-300 ${loading ? "animate-pulse opacity-60" : ""
                }`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${stat.color}`}></div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                {stat.label}
              </p>
              <h2 className="text-xl font-black text-white tracking-tighter">
                {loading ? "--------" : stat.value}
              </h2>
            </div>
          ))}
        </div>

        {/* KHU VỰC BỘ LỌC - ÔM KHÍT, TỰ ĐỘNG CĂN ĐỀU THEO CHIỀU CAO CỦA CÁC THẺ */}
        <div className="flex flex-col w-full lg:w-[380px] shrink-0 bg-zinc-900/40 backdrop-blur-md p-6 rounded-[24px] border border-white/5 shadow-xl justify-between">

          {/* Tiêu đề nhóm lọc */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            <p className="text-xs font-black text-zinc-300 uppercase tracking-widest">
              Bộ lọc dữ liệu tổng quan
            </p>
          </div>

          {/* Cụm input lịch và các nút bấm nhanh */}
          <div className="space-y-4 flex-1 flex flex-col justify-center my-auto pt-4">
            {/* Hàng ô Input lịch */}
            <div className="flex items-center justify-between bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/80 w-full">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-none text-xs font-black text-rose-500 outline-none p-2 flex-1 min-w-0"
              />
              <span className="text-zinc-800 px-2 font-black">|</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-none text-xs font-black text-rose-500 outline-none p-2 flex-1 min-w-0"
              />
              <button
                onClick={handleFilter}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-lg text-xs font-black uppercase transition-all shadow-md shadow-rose-600/20 shrink-0"
              >
                Lọc
              </button>
            </div>

            {/* 3 Nút lọc nhanh trải rộng 100% */}
            <div className="grid grid-cols-3 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/60 shadow-inner w-full">
              <button
                onClick={() => handleQuickFilter("today")}
                className={`text-[11px] font-black uppercase tracking-wider py-2.5 rounded-lg transition-all ${activeTab === "today"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/10"
                  : "text-zinc-400 hover:text-white bg-transparent"
                  }`}
              >
                Hôm nay
              </button>
              <button
                onClick={() => handleQuickFilter("7days")}
                className={`text-[11px] font-black uppercase tracking-wider py-2.5 rounded-lg transition-all ${activeTab === "7days"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/10"
                  : "text-zinc-400 hover:text-white bg-transparent"
                  }`}
              >
                7 ngày
              </button>
              <button
                onClick={() => handleQuickFilter("30days")}
                className={`text-[11px] font-black uppercase tracking-wider py-2.5 rounded-lg transition-all ${activeTab === "30days"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/10"
                  : "text-zinc-400 hover:text-white bg-transparent"
                  }`}
              >
                30 ngày
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* CHART & TOP MOVIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KHU VỰC BIỂU ĐỒ */}
        <div className="lg:col-span-2 bg-zinc-900/30 backdrop-blur-md p-8 rounded-[40px] border border-zinc-800 shadow-2xl min-w-0 min-h-[520px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <span className={`w-2 h-2 bg-emerald-500 rounded-full ${loading ? "animate-ping" : "animate-pulse"}`}></span>
              Biểu đồ doanh thu
            </h3>
            <button
              onClick={handleExportExcel}
              className="bg-zinc-800 hover:bg-emerald-600 text-zinc-400 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 border border-white/5"
            >
              📥 Xuất file Excel
            </button>
          </div>

          <div className="w-full relative flex-1 flex items-center justify-center min-h-[350px]">
            <div className={`w-full transition-opacity duration-300 ${!isReady || loading ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
              <ResponsiveContainer width="100%" aspect={2.2}>
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />

                  {/* TRỤC X: TỰ ĐỘNG RÚT GỌN CHỮ VÀ LUÔN ĐỂ THẲNG NẰM NGANG */}
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => {
                      if (chartData.length > 10) {
                        return value.replace("Ngày ", "");
                      }
                      return value;
                    }}
                    tick={{ fill: "#71717a", fontSize: 10, fontWeight: 800 }}
                    dy={12}
                    angle={0}
                    textAnchor="middle"
                    interval={0}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#71717a", fontSize: 10, fontWeight: 800 }}
                    tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}Tr` : v)}
                  />
                  <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} content={<CustomTooltip />} />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} onClick={handleBarClick} className="cursor-pointer">
                    {chartData.map((_, i) => (
                      <Cell key={`c-${i}`} fill="#06b6d4" className="hover:fill-[#10b981] transition-all duration-200" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Vòng xoay loading nội bộ */}
            {(!isReady || loading) && (
              <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
                <div className="w-8 h-8 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* TOP MOVIES */}
        <div className="lg:col-span-1 bg-zinc-900/30 backdrop-blur-md p-8 rounded-[40px] border border-zinc-800 shadow-2xl flex flex-col min-w-0">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">
            🔥 Top Doanh Thu Phòng Vé
          </h3>
          <div className={`flex-1 space-y-4 transition-opacity duration-300 ${loading ? "opacity-40 animate-pulse" : "opacity-100"}`}>
            {topMovies.length > 0 ? (
              topMovies.map((movie, index) => (
                <div
                  key={index}
                  className="bg-zinc-950/50 p-4 rounded-2xl border border-white/5 hover:border-rose-500/30 transition-all group flex items-center gap-4"
                >
                  <div className="text-2xl">{medals[index]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white truncate uppercase">
                      {movie.movieName}
                    </p>
                    <p className="text-[10px] font-bold text-emerald-500 mt-1">
                      {formatFullCurrency(movie.revenue)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-20 font-black uppercase text-xs">
                Trống
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {isModalOpen && selectedDay && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-zinc-900 rounded-[40px] border border-white/10 shadow-2xl w-full max-w-5xl overflow-hidden max-h-[85vh] flex flex-col animate-slideUp">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                  Báo cáo chi tiết: {
                    (() => {
                      const dayMonth = selectedDay.name.replace("Ngày ", "");
                      const filterDate = new Date(startDate);
                      const currentYear = filterDate.getFullYear();

                      if (dayMonth.includes("/")) {
                        return `Ngày ${dayMonth}/${currentYear}`;
                      }

                      const month = String(filterDate.getMonth() + 1).padStart(2, '0');
                      return `Ngày ${dayMonth}/${month}/${currentYear}`;
                    })()
                  }
                </h3>
                <p className="text-sm font-black text-emerald-400 mt-1.5 tracking-wide">
                  Tổng thu ngày: {formatFullCurrency(selectedDay.revenue)}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-rose-600 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scroll">
              {loadingDetail ? (
                <div className="py-20 flex justify-center">
                  <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-zinc-500 uppercase text-[9px] font-black tracking-widest border-b border-white/5">
                      <th className="py-4">Rạp</th>
                      <th className="py-4">Phim</th>
                      <th className="py-4 text-center">Vé</th>
                      <th className="py-4 text-center">Combo</th>
                      <th className="py-4 text-right">Doanh Thu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {detailData.map((item, i) => (
                      <tr key={i} className="hover:bg-white/5">
                        <td className="py-5 font-bold text-zinc-300 text-xs">{item.cinema}</td>
                        <td className="py-5 text-white font-black text-xs uppercase">{item.movie}</td>
                        <td className="py-5 text-center text-zinc-400 font-black text-xs">{item.tickets}</td>
                        <td className="py-5 text-center text-zinc-400 font-black text-xs">{item.combos}</td>
                        <td className="py-5 text-right text-emerald-500 font-black text-xs">
                          {formatFullCurrency(item.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
      `}</style>
    </div>
  );
};

const medals = ["🥇", "🥈", "🥉"];
export default AdminStatisticsPage;