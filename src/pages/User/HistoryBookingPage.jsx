import React, { useState, useEffect } from "react";
import api from "../../service/api";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const HistoryBookingPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // STATE MỚI: Đóng/Mở lịch sử vé cũ
  const [showPastTickets, setShowPastTickets] = useState(false);

  const [availableCombos, setAvailableCombos] = useState([]);
  const [orderCombos, setOrderCombos] = useState({});

  useEffect(() => {
    fetchHistory();
    fetchCombos();
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/user/bookings/history");
      setHistory(response.data);
      if (response.data.length > 0) setSelectedInvoice(response.data[0]);
    } catch (error) {
      toast.error("Vui lòng đăng nhập để xem vé!");
      navigate("/login");
    }
  };

  const fetchCombos = async () => {
    try {
      const res = await api.get("/public/combobongnuoc");
      setAvailableCombos(res.data);
    } catch (e) {
      console.error("Lỗi lấy menu bắp nước");
    }
  };

  const changeQty = (id, delta) => {
    setOrderCombos((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const comboTotal = availableCombos.reduce(
    (sum, c) => sum + (orderCombos[c.id] || 0) * c.price,
    0,
  );
  const finalTotal = (selectedInvoice?.totalPrice || 0) + comboTotal;

  const upcomingTickets = history.filter(
    (item) => new Date(item.showTime).getTime() >= now,
  );
  const pastTickets = history.filter(
    (item) => new Date(item.showTime).getTime() < now,
  );

  const handleConfirmPayment = async () => {
    try {
      const comboRequests = Object.entries(orderCombos)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => ({ comboId: parseInt(id), quantity: qty }));

      await api.post(
        `user/bookings/invoices/${selectedInvoice.invoiceId}/combos`,
        comboRequests,
      );

      navigate(`/payment/${selectedInvoice.invoiceId}`);
    } catch (error) {
      alert("Lỗi cập nhật đơn hàng rồi bác ơi!");
    }
  };

  const getRemainingTime = (createdAt) => {
    const diff = new Date(createdAt).getTime() + 10 * 60 * 1000 - now;
    if (diff <= 0) return "HẾT HẠN";
    return `${Math.floor(diff / 60000)}:${Math.floor((diff % 60000) / 1000)
      .toString()
      .padStart(2, "0")}`;
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const statusConfig = {
    CONFIRMED: {
      bg: "bg-emerald-950",
      text: "text-emerald-300",
      border: "border-emerald-700",
      label: "ĐÃ THANH TOÁN",
    },
    PENDING: {
      bg: "bg-amber-950",
      text: "text-amber-300",
      border: "border-amber-700",
      label: "CHỜ THANH TOÁN",
    },
    CANCELLED: {
      bg: "bg-zinc-800",
      text: "text-zinc-500",
      border: "border-zinc-700",
      label: "ĐÃ HỦY",
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Đang cập nhật";
    const date = new Date(dateString);
    return (
      date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) +
      " - " +
      date.toLocaleDateString("vi-VN")
    );
  };

  const TicketCard = ({ invoice }) => {
    const isPast = new Date(invoice.showTime).getTime() < now;
    const currentStatus =
      statusConfig[invoice.status] || statusConfig.CANCELLED;
    const isActive = selectedInvoice?.invoiceId === invoice.invoiceId;

    return (
      <div
        onClick={() => {
          setSelectedInvoice(invoice);
          setOrderCombos({});
        }}
        className={`bg-zinc-900 rounded-3xl border transition-all cursor-pointer flex gap-5 p-4 shadow-xl mb-4 hover:scale-[1.02] ${
          isActive ? "border-amber-500 shadow-amber-900/40" : "border-zinc-800"
        } ${isPast ? "opacity-50 grayscale hover:grayscale-0 hover:opacity-100" : ""}`}
      >
        <img
          src={invoice.posterUrl}
          className="w-20 h-32 rounded-2xl object-cover shadow-2xl border border-zinc-700 flex-shrink-0"
          alt="poster"
        />
        <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
          <div className="space-y-1">
            <div className="flex justify-between items-start gap-2">
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                {formatDate(invoice.showTime)}
              </p>
              <span
                className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
              >
                {isPast && invoice.status === "CONFIRMED"
                  ? "ĐÃ SỬ DỤNG"
                  : currentStatus.label}
              </span>
            </div>
            <h3 className="font-black text-zinc-50 text-base truncate uppercase">
              {invoice.movieTitle}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400 font-medium">
              <span>📍 {invoice.cinemaName}</span>
              <span>• Phòng {invoice.roomName}</span>
            </div>
          </div>

          <div className="flex justify-between items-end pt-2 border-t border-dashed border-zinc-800 mt-2">
            <span className="font-black text-rose-500 text-base">
              {formatMoney(invoice.totalPrice)}
            </span>
            {invoice.status === "PENDING" && !isPast && (
              <span className="text-[10px] text-amber-300 font-bold bg-amber-950 px-2 py-1 rounded-full animate-pulse">
                ⏳ {getRemainingTime(invoice.createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* CỘT TRÁI: DANH SÁCH VÉ */}
        <div className="lg:w-[45%] space-y-10">
          <div>
            <h2 className="text-3xl font-black text-zinc-50 mb-8 flex items-center gap-4">
              <span className="text-rose-600 bg-rose-950/30 p-2 rounded-2xl">
                🎟️
              </span>
              VÉ BẠN ĐẶT
            </h2>
            {upcomingTickets.length === 0 ? (
              <div className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl p-12 text-center text-zinc-600 font-bold">
                Bác chưa có vé nào sắp tới cả
              </div>
            ) : (
              upcomingTickets.map((inv) => (
                <TicketCard key={inv.invoiceId} invoice={inv} />
              ))
            )}
          </div>

          {/* PHẦN LỊCH SỬ VÉ CŨ - CÓ MŨI TÊN XỔ XUỐNG */}
          {pastTickets.length > 0 && (
            <div className="pt-6 border-t border-zinc-800">
              <button
                onClick={() => setShowPastTickets(!showPastTickets)}
                className="flex items-center justify-between w-full group bg-zinc-900/50 p-4 rounded-2xl hover:bg-zinc-900 transition-all"
              >
                <h2 className="text-xl font-bold text-zinc-500 group-hover:text-zinc-300 flex items-center gap-3 uppercase tracking-wider">
                  <span className="text-zinc-600">🕒</span> Vé đã sử dụng (
                  {pastTickets.length})
                </h2>
                <span
                  className={`text-zinc-500 transition-transform duration-300 ${showPastTickets ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>

              {showPastTickets && (
                <div className="mt-6 animate-in slide-in-from-top-2 duration-300">
                  {pastTickets.map((inv) => (
                    <TicketCard key={inv.invoiceId} invoice={inv} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CỘT PHẢI: CHI TIẾT */}
        <div className="lg:w-[55%]">
          {selectedInvoice ? (
            <div className="sticky top-12 bg-zinc-900 rounded-[45px] shadow-2xl border border-zinc-800 overflow-hidden">
              {/* Header chi tiết */}
              <div className="bg-zinc-950 p-10 relative">
                <div className="flex justify-between items-start mb-8 gap-6">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-rose-500 text-[10px] font-black tracking-[0.3em] uppercase mb-1">
                      HÓA ĐƠN #{selectedInvoice.invoiceId}
                    </p>
                    <h2 className="text-3xl font-black leading-tight uppercase text-zinc-50 truncate">
                      {selectedInvoice.movieTitle}
                    </h2>
                    <p className="text-zinc-400 font-medium text-sm pt-1">
                      📍 {selectedInvoice.cinemaName}
                    </p>
                  </div>
                  <div className="bg-zinc-800 border border-zinc-700 px-6 py-4 rounded-3xl text-center">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">
                      Phòng
                    </p>
                    <p className="text-2xl font-black text-zinc-50">
                      {selectedInvoice.roomName}
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex items-center gap-4 text-amber-400 font-bold">
                  <span className="text-zinc-500 font-medium text-sm uppercase">
                    Ghế ngồi:
                  </span>
                  <span className="text-base tracking-wider flex-1 truncate">
                    {selectedInvoice.seatNames.join(", ")}
                  </span>
                </div>
              </div>

              <div className="p-10">
                {selectedInvoice.status === "CONFIRMED" ? (
                  <div className="flex flex-col items-center py-6">
                    {/* KHUNG QR: ĐÃ ẨN MÃ TEXT THEO Ý BÁC */}
                    <div className="p-8 bg-white rounded-[40px] shadow-2xl mb-8">
                      <QRCodeSVG
                        value={`TICKET_${selectedInvoice.ticketCode}`}
                        size={240}
                        includeMargin={true}
                      />
                    </div>

                    <div className="text-center space-y-2 mb-10">
                      <p className="text-zinc-400 text-sm font-medium">
                        Quét mã này tại rạp để nhận vé bác nhé!
                      </p>
                      <div className="flex justify-center gap-2">
                        <div className="h-1 w-8 bg-rose-600 rounded-full"></div>
                        <div className="h-1 w-1 bg-zinc-700 rounded-full"></div>
                        <div className="h-1 w-1 bg-zinc-700 rounded-full"></div>
                      </div>
                    </div>

                    {selectedInvoice.comboNames &&
                      selectedInvoice.comboNames.length > 0 && (
                        <div className="w-full bg-zinc-950 p-8 rounded-3xl border border-zinc-800">
                          <p className="text-amber-400 font-black text-xs uppercase mb-5 tracking-[0.2em]">
                            🍿 Combo bắp nước:
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {selectedInvoice.comboNames.map((name, i) => (
                              <span
                                key={i}
                                className="bg-zinc-800 px-5 py-2.5 rounded-xl text-xs font-black border border-zinc-700 text-zinc-100"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ) : selectedInvoice.status === "PENDING" &&
                  new Date(selectedInvoice.showTime).getTime() >= now ? (
                  <div className="space-y-10">
                    <div className="text-center">
                      <h4 className="font-black text-zinc-50 uppercase text-lg tracking-widest italic">
                        Mua thêm bắp nước
                      </h4>
                      <div className="w-12 h-1 bg-rose-600 mx-auto mt-2 rounded-full"></div>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-3 custom-scroll">
                      {availableCombos.map((combo) => (
                        <div
                          key={combo.id}
                          className="flex justify-between items-center p-5 bg-zinc-950 rounded-3xl border border-zinc-800 hover:border-amber-900/50 transition-all"
                        >
                          <div className="flex-1 min-w-0 pr-5">
                            <h4 className="font-black text-zinc-100 text-sm truncate uppercase">
                              {combo.name}
                            </h4>
                            <p className="text-[10px] text-zinc-500 font-medium line-clamp-1 mb-2 leading-relaxed">
                              {combo.description}
                            </p>
                            <span className="text-rose-500 font-black text-sm">
                              {formatMoney(combo.price)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 bg-zinc-900 p-2 rounded-full border border-zinc-800 shadow-inner">
                            <button
                              onClick={() => changeQty(combo.id, -1)}
                              className="w-8 h-8 flex items-center justify-center font-black text-zinc-600 hover:text-rose-500 text-lg transition-colors"
                            >
                              -
                            </button>
                            <span className="text-sm font-black w-4 text-center text-zinc-100">
                              {orderCombos[combo.id] || 0}
                            </span>
                            <button
                              onClick={() => changeQty(combo.id, 1)}
                              className="w-8 h-8 flex items-center justify-center font-black text-zinc-600 hover:text-emerald-500 text-lg transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-zinc-950 rounded-[35px] p-8 border border-zinc-800 shadow-2xl">
                      <div className="space-y-3 mb-8 text-[11px] font-bold uppercase text-zinc-500 tracking-tighter">
                        <div className="flex justify-between">
                          <span>
                            Tiền vé ({selectedInvoice.seatNames.length} ghế)
                          </span>
                          <span>{formatMoney(selectedInvoice.totalPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tiền bắp nước</span>
                          <span>{formatMoney(comboTotal)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-8 pt-6 border-t border-zinc-800">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                          Tổng tiền
                        </p>
                        <p className="text-3xl font-black text-amber-400 tracking-tighter">
                          {formatMoney(finalTotal)}
                        </p>
                      </div>
                      <button
                        onClick={handleConfirmPayment}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-rose-900/20"
                      >
                        THANH TOÁN NGAY
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-24 text-center">
                    <div className="text-6xl mb-6 opacity-10">⌛</div>
                    <p className="font-black text-xl text-zinc-600 uppercase tracking-[0.2em]">
                      Hết hạn sử dụng
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-[500px] border-2 border-dashed border-zinc-800 rounded-[50px] flex flex-col items-center justify-center text-zinc-700 gap-4">
              <span className="text-5xl animate-bounce">👈</span>
              <p className="font-bold text-sm uppercase tracking-widest">
                Bác chọn vé để xem nhé
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CSS cho thanh cuộn bắp nước */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default HistoryBookingPage;
