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

  // STATE MỚI: QUẢN LÝ BẮP NƯỚC
  const [availableCombos, setAvailableCombos] = useState([]); // Thực đơn từ DB
  const [orderCombos, setOrderCombos] = useState({}); // { comboId: số lượng }

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
      toast.error("Vui lòng đăng nhập để xem vé!")
      navigate("/login")
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

  // HÀM TĂNG GIẢM SỐ LƯỢNG COMBO
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
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "ĐÃ THANH TOÁN",
    },
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      label: "CHỜ THANH TOÁN",
    },
    CANCELLED: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "ĐÃ HỦY",
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Đang cập nhật";
    const date = new Date(dateString);
    const time = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const day = date.toLocaleDateString("vi-VN");
    return `${time} - ${day}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* CỘT TRÁI: DANH SÁCH HÓA ĐƠN */}
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-2">
            <span className="text-blue-600">🎟️</span> Vé của tôi
          </h2>

          {history.length === 0 ? (
            <p className="text-center py-20 text-slate-400">
              Bác chưa có hóa đơn nào.
            </p>
          ) : (
            history.map((invoice, index) => {
              const currentStatus =
                statusConfig[invoice.status] || statusConfig.CANCELLED;
              const isActive = selectedInvoice?.invoiceId === invoice.invoiceId;

              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setOrderCombos({});
                  }}
                  className={`bg-white rounded-3xl border-2 transition-all cursor-pointer flex gap-4 p-2 shadow-sm ${
                    isActive
                      ? "border-blue-500 scale-[1.02]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${invoice.posterUrl}`}
                    className="w-24 h-32 rounded-2xl object-cover"
                    alt="p"
                  />
                  <div className="flex-1 py-3 pr-4 pl-3 flex flex-col justify-between h-full gap-2">
                    {/* Phần trên: Thời gian + Tên phim + Trạng thái */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {" "}
                        {/* min-w-0 giúp thẻ con có thể dùng truncate/line-clamp */}
                        <p className="text-[10px] sm:text-xs font-semibold text-blue-600 mb-0.5 uppercase tracking-wide">
                          {/* Nhớ dùng hàm formatDate để giờ hiển thị đẹp nhé bác */}
                          {formatDate(invoice.showTime)}
                        </p>
                        <h3
                          className="font-bold text-slate-800 text-sm sm:text-base leading-tight line-clamp-2"
                          title={invoice.movieTitle}
                        >
                          {invoice.movieTitle}
                        </h3>
                      </div>

                      <span
                        className={`shrink-0 px-2 py-1 rounded-md text-[10px] font-bold border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
                      >
                        {currentStatus.label}
                      </span>
                    </div>

                    {/* Phần giữa: Thông tin ghế ngồi */}
                    <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        ></path>
                      </svg>
                      Ghế:{" "}
                      <span className="font-semibold text-slate-700">
                        {invoice.seatNames.join(", ")}
                      </span>
                    </p>

                    {/* Phần dưới: Tổng tiền + Thời gian chờ (Có gạch đứt phân cách) */}
                    <div className="flex justify-between items-end border-t border-dashed border-slate-200 pt-2.5 mt-auto">
                      <span className="font-black text-red-500 text-sm sm:text-base tracking-tight">
                        {formatMoney(invoice.totalPrice)}
                      </span>

                      {invoice.status === "PENDING" && (
                        <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded-md animate-pulse flex items-center gap-1 border border-amber-100">
                          ⏳ {getRemainingTime(invoice.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* CỘT PHẢI: CHI TIẾT & CHỌN COMBO */}
        <div className="lg:w-1/2 sticky top-10 h-fit">
          {selectedInvoice ? (
            <div className="bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 p-8 text-white">
                <p className="text-[10px] text-blue-400 font-bold uppercase mb-2">
                  Hóa đơn #{selectedInvoice.invoiceId}
                </p>
                <h2 className="text-3xl font-black">
                  {selectedInvoice.movieTitle}
                </h2>
              </div>

              <div className="p-8">
                {selectedInvoice.status === "CONFIRMED" ? (
                  <div className="flex flex-col items-center gap-6 py-4">
                    <div className="p-4 bg-white border-4 border-slate-50 rounded-[32px] shadow-inner">
                      <QRCodeSVG
                        value={`TICKET_${selectedInvoice.ticketCode}`}
                        size={200}
                      />
                    </div>
                    <p className="text-slate-400 text-sm italic">
                      Quét mã này tại rạp bác nhé!
                    </p>
                  </div>
                ) : selectedInvoice.status === "PENDING" ? (
                  <div className="space-y-6">
                    <h4 className="font-black text-slate-800 flex items-center gap-2 italic">
                      🍿 THÊM BẮP NƯỚC CHO VUI:
                    </h4>

                    {/* LIST COMBO */}
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {availableCombos.map((combo) => (
                        <div
                          key={combo.id}
                          className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100"
                        >
                          <div className="flex-1 min-w-0">
                            <h4
                              className="font-bold text-sm sm:text-base text-slate-800 mb-0.5 truncate"
                              title={combo.name}
                            >
                              {combo.name}
                            </h4>

                            <p
                              className="text-[11px] sm:text-xs text-slate-500 font-medium leading-snug line-clamp-2 mb-2"
                              title={combo.description}
                            >
                              {combo.description}
                            </p>

                            {/* Giá tiền: To, rõ, có mảng nền làm nổi bật */}
                            <span className="inline-block bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs sm:text-sm font-black tracking-tight">
                              {formatMoney(combo.price)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-full border shadow-sm">
                            <button
                              onClick={() => changeQty(combo.id, -1)}
                              className="w-6 h-6 flex items-center justify-center font-bold text-slate-400 hover:text-red-500"
                            >
                              -
                            </button>
                            <span className="text-sm font-bold w-4 text-center">
                              {orderCombos[combo.id] || 0}
                            </span>
                            <button
                              onClick={() => changeQty(combo.id, 1)}
                              className="w-6 h-6 flex items-center justify-center font-bold text-slate-400 hover:text-green-500"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 border-dashed border-slate-100 pt-6">
                      <div className="flex justify-between text-xs text-slate-500 mb-1 italic">
                        <span>
                          Tiền vé ({selectedInvoice.seatNames.length} ghế):
                        </span>
                        <span>{formatMoney(selectedInvoice.totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mb-4 italic">
                        <span>Tiền Combo:</span>
                        <span>{formatMoney(comboTotal)}</span>
                      </div>

                      <div className="flex justify-between items-center bg-slate-900 p-5 rounded-3xl text-white shadow-xl">
                        <span className="font-bold text-sm opacity-70 uppercase">
                          Tổng cộng:
                        </span>
                        <span className="text-3xl font-black text-yellow-400 tracking-tighter">
                          {formatMoney(finalTotal)}
                        </span>
                      </div>

                      <button
                        onClick={handleConfirmPayment}
                        className="w-full mt-6 bg-red-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-red-700 shadow-xl shadow-red-200 transition-all active:scale-95"
                      >
                        XÁC NHẬN THANH TOÁN
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center opacity-20 grayscale">
                    <div className="text-6xl mb-4">🚫</div>
                    <p className="font-black text-2xl text-red-600 uppercase">
                      Đã quá hạn
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-64 border-4 border-dashed border-slate-200 rounded-[40px] flex items-center justify-center text-slate-300 font-bold">
              Bác chọn một hóa đơn bên trái nhé
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryBookingPage;
