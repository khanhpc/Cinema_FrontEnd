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
  const [isReady, setIsReady] = useState(false); // State để đợi layout ổn định

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const fetchStatistics = async (start, end) => {
    setLoading(true);
    setIsReady(false); // Reset lại khi lọc
    try {
      const [overviewRes, chartRes, topRes] = await Promise.all([
        api.get(`/admin/stats/overview?start=${start}&end=${end}`),
        api.get(`/admin/stats/revenue-7-days?start=${start}&end=${end}`),
        api.get(`/admin/stats/top-movies?start=${start}&end=${end}`),
      ]);
      setOverview(overviewRes.data);
      setChartData(chartRes.data);
      setTopMovies(topRes.data);

      // Đợi 300ms cho hiệu ứng CSS chạy xong rồi mới hiện biểu đồ
      setTimeout(() => setIsReady(true), 300);
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
    fetchStatistics(startDate, endDate);
  };

  const formatFullCurrency = (v) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v || 0);

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
    const excelData = [
      ["BÁO CÁO DOANH THU"],
      ["Tổng thu:", formatFullCurrency(overview.totalRevenue)],
      ["Số vé:", overview.totalTickets],
      [],
      ["Ngày", "Doanh Thu"],
    ];
    chartData.forEach((item) => excelData.push([item.name, item.revenue]));
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stats");
    XLSX.writeFile(wb, `DoanhThu_${endDate}.xlsx`);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-4 lg:p-8 space-y-8 bg-transparent min-h-full font-sans animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Cinema Dashboard
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
            Hệ thống thống kê thời gian thực
          </p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900/80 p-2 rounded-2xl border border-zinc-800 backdrop-blur-xl shadow-2xl">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent border-none text-xs font-black text-rose-500 outline-none p-2"
          />
          <span className="text-zinc-700">|</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent border-none text-xs font-black text-rose-500 outline-none p-2"
          />
          <button
            onClick={handleFilter}
            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-xl text-xs font-black uppercase transition-all shadow-lg shadow-rose-600/20"
          >
            Lọc
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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
            label: "Combo Đã Bán",
            value: `${overview.totalCombos} Bộ`,
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
            className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-[30px] border border-white/5 relative overflow-hidden group"
          >
            <div
              className={`absolute top-0 left-0 w-1 h-full ${stat.color}`}
            ></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
              {stat.label}
            </p>
            <h2 className="text-2xl font-black text-white tracking-tighter">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* CHART & TOP MOVIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KHU VỰC BIỂU ĐỒ - FIX TRIỆT ĐỂ LỖI WIDTH/HEIGHT */}
        <div className="lg:col-span-2 bg-zinc-900/30 backdrop-blur-md p-8 rounded-[40px] border border-zinc-800 shadow-2xl min-w-0">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span>
              Tăng trưởng doanh thu
            </h3>
            <button
              onClick={handleExportExcel}
              className="bg-zinc-800 hover:bg-emerald-600 text-zinc-400 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 border border-white/5"
            >
              📥 Excel
            </button>
          </div>

          {/* Wrapper có chiều cao cố định để Recharts không bị lỗi -1 */}
          <div className="w-full relative min-h-[350px]">
            {isReady ? (
              <ResponsiveContainer width="100%" aspect={2}>
                <BarChart
                  data={chartData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#ffffff10"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#52525b", fontSize: 10, fontWeight: 800 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#52525b", fontSize: 10, fontWeight: 800 }}
                    tickFormatter={(v) =>
                      v >= 1000000 ? `${(v / 1000000).toFixed(1)}Tr` : v
                    }
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                    contentStyle={{
                      background: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: "12px",
                    }}
                    formatter={(v) => [formatFullCurrency(v), "Doanh thu"]}
                  />
                  <Bar
                    dataKey="revenue"
                    radius={[8, 8, 0, 0]}
                    onClick={handleBarClick}
                    className="cursor-pointer"
                  >
                    {chartData.map((_, i) => (
                      <Cell
                        key={`c-${i}`}
                        fill="#e11d48"
                        fillOpacity={0.7}
                        className="hover:fill-opacity-100 transition-all"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-zinc-700 font-black uppercase tracking-widest text-xs animate-pulse">
                Đang dựng sơ đồ...
              </div>
            )}
          </div>
        </div>

        {/* TOP MOVIES */}
        <div className="lg:col-span-1 bg-zinc-900/30 backdrop-blur-md p-8 rounded-[40px] border border-zinc-800 shadow-2xl flex flex-col min-w-0">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">
            🔥 Top Doanh Thu Phòng Vé
          </h3>
          <div className="flex-1 space-y-4">
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
                  Báo cáo: {selectedDay.name}
                </h3>
                <p className="text-xs font-bold text-rose-500 mt-1">
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
                <div className="py-20 text-center animate-spin">⏳</div>
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
                        <td className="py-5 font-bold text-zinc-300 text-xs">
                          {item.cinema}
                        </td>
                        <td className="py-5 text-white font-black text-xs uppercase">
                          {item.movie}
                        </td>
                        <td className="py-5 text-center text-zinc-400 font-black text-xs">
                          {item.tickets}
                        </td>
                        <td className="py-5 text-center text-zinc-400 font-black text-xs">
                          {item.combos}
                        </td>
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
