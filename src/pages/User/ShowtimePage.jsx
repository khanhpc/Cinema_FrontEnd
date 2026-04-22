import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../service/api';

const ShowtimePage = () => {
    const navigate = useNavigate();
    const { movieId } = useParams();

    const [cinemasData, setCinemasData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCinema, setSelectedCinema] = useState(null);

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

    const sortedSchedule = selectedCinema?.schedule
        ? [...selectedCinema.schedule]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(day => ({
                ...day,
                rooms: [...day.rooms]
                    .sort((a, b) => a.roomName.localeCompare(b.roomName))
                    .map(room => ({
                        ...room,
                        times: [...room.times]
                            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                    }))
            }))
        : [];

    // ==========================================
    // TRẠNG THÁI LOADING CHUNG
    // ==========================================
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
                <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-slate-500 font-medium animate-pulse">Đang kết nối hệ thống rạp...</p>
            </div>
        );
    }

    // ==========================================
    // MÀN HÌNH 1: CHỌN RẠP CHIẾU
    // ==========================================
    if (!selectedCinema) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Bác muốn xem ở rạp nào?
                        </h2>
                        <p className="mt-2 text-slate-500 font-medium">Vui lòng chọn cụm rạp để xem suất chiếu</p>
                    </div>

                    {cinemasData.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                            <p className="text-slate-500 font-medium">Phim này hiện chưa có lịch chiếu tại bất kỳ rạp nào.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cinemasData.map((cinema) => (
                                <button
                                    key={cinema.cinemaId}
                                    onClick={() => setSelectedCinema(cinema)}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 text-left group"
                                >
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">{cinema.cinemaName}</h3>
                                    {/* Bác có thể hiển thị thêm địa chỉ rạp nếu API có trả về trường address */}
                                    <p className="text-sm text-slate-500 line-clamp-1">Nhấn để xem suất chiếu</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ==========================================
    // MÀN HÌNH 2: CHỌN NGÀY VÀ GIỜ CHIẾU
    // ==========================================
    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Thanh điều hướng: Tên rạp và Nút quay lại */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Đang chọn lịch chiếu tại</p>
                        <h2 className="text-xl font-extrabold text-blue-700 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                            {selectedCinema.cinemaName}
                        </h2>
                    </div>
                    <button
                        onClick={() => setSelectedCinema(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Chọn rạp khác
                    </button>
                </div>

                {/* Danh sách suất chiếu */}
                {sortedSchedule.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-slate-500 font-medium">Rạp này hiện chưa có suất chiếu nào.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedSchedule.map((day) => (
                            <div key={day.date} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md">
                                <div className="bg-slate-900 px-6 py-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <span className="bg-blue-500/20 text-blue-300 p-1.5 rounded-lg">🗓️</span>
                                        Ngày chiếu: <span className="text-blue-400 ml-1">{new Date(day.date).toLocaleDateString('vi-VN')}</span>
                                    </h3>
                                </div>

                                <div className="p-6 space-y-8">
                                    {day.rooms.map((room) => (
                                        <div key={room.roomId} className="flex flex-col md:flex-row md:items-start gap-4">
                                            <div className="md:w-1/4 flex-shrink-0">
                                                <h4 className="font-semibold text-slate-700 flex items-center gap-2 text-base">
                                                    🚪 <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">{room.roomName}</span>
                                                </h4>
                                            </div>
                                            <div className="md:w-3/4 flex flex-wrap gap-3">
                                                {room.times.map((time) => (
                                                    <button
                                                        key={time.showtimeId}
                                                        onClick={() => navigate(`/seats/${time.showtimeId}/${room.roomId}`)}
                                                        className="group relative px-6 py-2.5 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                                    >
                                                        {new Date(time.startTime).toLocaleTimeString('vi-VN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                                                            Chọn suất này
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowtimePage;