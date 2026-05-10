import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../service/api";

const ShowtimePage = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();

  const [cinemasData, setCinemasData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchShowtimesData();
  }, [movieId]);

  const fetchShowtimesData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`public/showtimes/movie/${movieId}`);
      setCinemasData(response.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách rạp và lịch chiếu: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTab = (dateStr) => {
    const d = new Date(dateStr);
    const weekday = d.toLocaleDateString("vi-VN", { weekday: "short" });
    const day = d.getDate();
    const month = d.getMonth() + 1;
    return { weekday, day, month, full: dateStr };
  };

  const sortedSchedule = selectedCinema?.schedule
    ? [...selectedCinema.schedule].sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      )
    : [];

  useEffect(() => {
    if (sortedSchedule.length > 0 && !selectedDate) {
      setSelectedDate(sortedSchedule[0].date);
    }
  }, [selectedCinema, sortedSchedule]);

  const activeDayData = sortedSchedule.find((day) => day.date === selectedDate);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-sans">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-rose-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-rose-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-zinc-400 font-bold tracking-widest animate-pulse uppercase">
          Đang kết nối hệ thống...
        </p>
      </div>
    );
  }

  // ==========================================
  // MÀN HÌNH 1: CHỌN CỤM RẠP
  // ==========================================
  if (!selectedCinema) {
    return (
      <div className="min-h-screen bg-zinc-950 py-16 px-6 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
              Chọn <span className="text-rose-600">Rạp Chiếu</span>
            </h2>
            <div className="h-1.5 w-24 bg-rose-600 mx-auto rounded-full"></div>
            <p className="text-zinc-500 text-lg">
              Vui lòng chọn rạp để xem lịch bác nhé
            </p>
          </div>

          {cinemasData.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/50 rounded-[40px] border border-zinc-800">
              <p className="text-zinc-500 text-xl font-bold">
                Phim này hiện chưa có lịch chiếu bác ạ!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cinemasData.map((cinema) => (
                <button
                  key={cinema.cinemaId}
                  onClick={() => setSelectedCinema(cinema)}
                  className="group relative bg-zinc-900 p-8 rounded-[32px] border border-zinc-800 hover:border-rose-500/50 transition-all duration-500 text-left overflow-hidden shadow-lg"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-rose-600/10 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shadow-inner">
                      {/* Icon Rạp - Đã sửa lỗi path */}
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 21h18M3 7v14M21 7v14M12 7v14M3 7l9-4 9 4M7 21v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-rose-500 transition-colors uppercase tracking-tight">
                      {cinema.cinemaName}
                    </h3>
                    <p className="text-zinc-500 font-bold flex items-center gap-2 text-sm uppercase">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      Xem suất chiếu ❯
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // MÀN HÌNH 2: CHỌN SUẤT CHIẾU
  // ==========================================
  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 font-sans text-zinc-200">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header điều hướng */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-900 p-6 rounded-[35px] border border-zinc-800 shadow-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedCinema(null)}
              className="w-12 h-12 flex items-center justify-center bg-zinc-800 hover:bg-rose-600 text-white rounded-2xl transition-all shadow-lg active:scale-90"
            >
              {/* Icon Back */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-1">
                Hệ thống rạp
              </p>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {selectedCinema.cinemaName}
              </h2>
            </div>
          </div>
        </div>

        {/* Thanh chọn ngày */}
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scroll scroll-smooth">
          {sortedSchedule.map((day) => {
            const dateInfo = formatDateTab(day.date);
            const isActive = selectedDate === day.date;
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`flex-shrink-0 w-24 py-5 rounded-[28px] border-2 transition-all duration-300 flex flex-col items-center gap-1
                                    ${
                                      isActive
                                        ? "bg-rose-600 border-rose-600 text-white shadow-xl shadow-rose-600/30 scale-105"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                    }`}
              >
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-rose-200" : "text-zinc-600"}`}
                >
                  {dateInfo.weekday}
                </span>
                <span className="text-2xl font-black">{dateInfo.day}</span>
                <span className="text-[11px] font-bold opacity-80">
                  Th. {dateInfo.month}
                </span>
              </button>
            );
          })}
        </div>

        {/* Danh sách phòng */}
        <div className="space-y-8 min-h-[400px]">
          {!activeDayData ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
              <p className="text-xl font-black italic tracking-widest uppercase opacity-30">
                Vui lòng chọn ngày
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              {activeDayData.rooms
                .sort((a, b) => a.roomName.localeCompare(b.roomName))
                .map((room) => (
                  <div
                    key={room.roomId}
                    className="bg-zinc-900 rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl transition-all hover:border-zinc-700"
                  >
                    <div className="bg-zinc-800/40 px-8 py-5 border-b border-zinc-800 flex justify-between items-center">
                      <h4 className="text-white font-black uppercase tracking-[0.2em] flex items-center gap-4 text-sm">
                        <span className="w-1.5 h-6 bg-rose-600 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.5)]"></span>
                        PHÒNG: {room.roomName}
                      </h4>
                      <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest border border-zinc-700 px-3 py-1 rounded-full">
                        Digital 2D
                      </span>
                    </div>

                    <div className="p-10 flex flex-wrap gap-5">
                      {room.times
                        .sort(
                          (a, b) =>
                            new Date(a.startTime) - new Date(b.startTime),
                        )
                        .map((time) => (
                          <button
                            key={time.showtimeId}
                            onClick={() =>
                              navigate(
                                `/seats/${time.showtimeId}/${room.roomId}`,
                              )
                            }
                            className="group relative px-10 py-5 bg-zinc-950 border border-zinc-800 rounded-2xl transition-all hover:bg-rose-600 hover:border-rose-600 hover:-translate-y-1.5 shadow-lg active:scale-95"
                          >
                            <span className="text-2xl font-black text-white transition-colors">
                              {new Date(time.startTime).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/20 rounded-full group-hover:w-12 group-hover:bg-white/40 transition-all"></div>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <style>
        {`
                .custom-scroll::-webkit-scrollbar { height: 6px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
                `}
      </style>
    </div>
  );
};

export default ShowtimePage;
