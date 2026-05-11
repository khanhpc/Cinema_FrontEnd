import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../service/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const SeatPage = () => {
  const navigate = useNavigate();
  const { showtimeId, roomId } = useParams();
  const [seats, setSeats] = useState([]);
  const [price, setPrice] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    fetchSeats();
  }, [showtimeId, roomId, navigate]);

  const fetchSeats = async () => {
    try {
      const response = await api.get(
        `/user/seats/showtime/${showtimeId}/room/${roomId}`,
      );
      const showtimeResponse = await api.get(`/public/showtimes/${showtimeId}`);
      setPrice(showtimeResponse.data.price);
      setSeats(response.data);
    } catch (error) {
      console.error("Lỗi lấy ghế:", error);
      toast.error("Vui Lòng Đăng Nhập Để Đặt Vé!");
      navigate(`/login`);
    }
  };

  const handleSelectSeat = (seat) => {
    if (seat.booked) return;
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        Swal.fire({
          title: "Bác ơi!",
          text: "Mỗi lần chỉ đặt được tối đa 6 ghế thôi nhé!",
          icon: "warning",
          background: "#18181b",
          color: "#fff",
          confirmButtonColor: "#e11d48",
        });
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;
    try {
      const bookingRequest = {
        showtimeId: parseInt(showtimeId),
        seatId: selectedSeats.map((s) => s.id),
      };
      await api.post(`/user/bookings/create`, bookingRequest);
      toast.success(
        `Bác đã chọn ${selectedSeats.length} ghế. Thanh toán thôi nào!`,
        {
          style: { background: "#18181b", color: "#fff" },
        },
      );
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi hệ thống rồi bác ơi!");
    }
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
    acc[seat.seatRow].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(groupedSeats).sort();

  const totalSurcharge = selectedSeats.reduce(
    (sum, s) => sum + s.surcharge + price,
    0,
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 py-10 px-4 md:px-10 font-sans animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* ================= BÊN TRÁI: SƠ ĐỒ GHẾ ================= */}
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
            <span className="w-2 h-8 bg-rose-600 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.5)]"></span>
            CHỌN GHẾ NGỒI
          </h2>

          {/* MÀN HÌNH CINEMA */}
          <div className="w-full max-w-2xl mb-16 relative">
            <div className="h-2 w-full bg-gradient-to-b from-rose-500 to-transparent rounded-full blur-sm opacity-50"></div>
            <div className="w-full h-12 bg-zinc-900 rounded-t-[100px] border-t-4 border-rose-600/30 flex items-center justify-center shadow-[0_-20px_50px_rgba(225,29,72,0.15)]">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-[1em] ml-4">
                MÀN HÌNH
              </span>
            </div>
          </div>

          {/* DÀN GHẾ */}
          <div className="space-y-4 overflow-x-auto pb-10 w-full flex flex-col items-center custom-scroll">
            {sortedRows.map((row) => (
              <div key={row} className="flex items-center gap-4 min-w-max">
                <div className="w-8 text-sm font-black text-zinc-600">
                  {row}
                </div>
                <div className="flex gap-2.5">
                  {groupedSeats[row]
                    .sort((a, b) => a.seatNumber - b.seatNumber)
                    .map((seat) => {
                      const isSelected = selectedSeats.some(
                        (s) => s.id === seat.id,
                      );

                      let seatClass =
                        "border transition-all duration-300 transform active:scale-90 hover:scale-110";
                      let seatStyles = {
                        width: seat.type === "SWEETBOX" ? "90px" : "40px",
                        height: "40px",
                      };

                      if (seat.booked) {
                        seatClass +=
                          " bg-zinc-900 border-zinc-800 text-zinc-700 cursor-not-allowed opacity-30";
                      } else if (isSelected) {
                        seatClass +=
                          " bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10";
                      } else if (seat.type === "VIP") {
                        seatClass +=
                          " bg-amber-600/10 border-amber-500 text-amber-500 hover:bg-amber-600/20";
                      } else if (seat.type === "SWEETBOX") {
                        seatClass +=
                          " bg-rose-600/10 border-rose-500 text-rose-500 hover:bg-rose-600/20";
                      } else {
                        seatClass +=
                          " bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500";
                      }

                      return (
                        <div
                          key={seat.id}
                          onClick={() => handleSelectSeat(seat)}
                          className={`rounded-lg flex items-center justify-center text-[10px] font-bold cursor-pointer ${seatClass}`}
                          style={seatStyles}
                        >
                          {seat.booked
                            ? "X"
                            : `${seat.seatRow}${seat.seatNumber}`}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= BÊN PHẢI: CHÚ THÍCH & TỔNG KẾT ================= */}
        <div className="lg:w-[350px] shrink-0">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-[35px] p-8 sticky top-10 shadow-2xl">
            {/* CHÚ THÍCH (LEGEND) */}
            <div className="space-y-4 mb-10">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-3">
                Chú thích ghế
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <LegendItem
                  color="bg-zinc-800 border-zinc-700"
                  label="Ghế Thường"
                />
                <LegendItem
                  color="bg-amber-600/20 border-amber-500"
                  label="Ghế VIP"
                />
                <LegendItem
                  color="bg-rose-600/20 border-rose-500"
                  label="Ghế Đôi (Sweetbox)"
                />
                <LegendItem
                  color="bg-emerald-500 border-emerald-400"
                  label="Ghế Đang Chọn"
                />
                <LegendItem
                  color="bg-zinc-900 border-zinc-800 opacity-30"
                  label="Ghế Đã Bán"
                  isBooked
                />
              </div>
            </div>

            {/* THÔNG TIN VÉ ĐÃ CHỌN */}
            <div className="space-y-6 pt-6 border-t border-zinc-800">
              {selectedSeats.length > 0 ? (
                <div className="animate-slideUp">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">
                    Vị trí đã chọn
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedSeats.map((s) => (
                      <span
                        key={s.id}
                        className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-black text-white uppercase"
                      >
                        {s.seatRow}
                        {s.seatNumber}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-end mb-8">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      Tạm tính
                    </p>
                    <p className="text-2xl font-black text-white tracking-tighter">
                      {totalSurcharge.toLocaleString()}{" "}
                      <span className="text-xs text-zinc-500 font-normal">
                        VNĐ
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={handleBooking}
                    className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-rose-600/20 active:scale-95 uppercase text-sm tracking-widest"
                  >
                    Xác nhận đặt {selectedSeats.length} vé
                  </button>
                </div>
              ) : (
                <div className="text-center py-10 opacity-30 italic text-sm">
                  Bác vui lòng chọn ghế để tiếp tục nhé!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
        .custom-scroll::-webkit-scrollbar { height: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

// Component phụ cho chú thích
const LegendItem = ({ color, label, isBooked }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-5 h-5 rounded border ${color} flex items-center justify-center text-[8px] font-bold`}
    >
      {isBooked ? "X" : ""}
    </div>
    <span className="text-xs font-bold text-zinc-400">{label}</span>
  </div>
);

export default SeatPage;
