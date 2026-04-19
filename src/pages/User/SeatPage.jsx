import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../service/api";
import toast from "react-hot-toast";

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
        toast.error("Vui Lòng Đăng Nhập Để Đặt Vé!")
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
        alert("Bác ơi, mỗi lần chỉ đặt được tối đa 6 ghế thôi nhé!");
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // 3. GỬI CẢ MẢNG ID GHẾ LÊN BACKEND
  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;

    try {
      const bookingRequest = {
        showtimeId: parseInt(showtimeId),
        seatId: selectedSeats.map((s) => s.id),
      };

      const response = await api.post(`/user/bookings/create`, bookingRequest);

      alert(`Đặt vé thành công! Bác có ${selectedSeats.length} ghế mới.`);
      // Sau khi đặt xong thì chuyển sang trang cá nhân xem vé cho "nuột"
      navigate("/profile");
    } catch (error) {
      console.error("Lỗi đặt vé:", error);
      alert(error.response?.data?.error || "Lỗi hệ thống rồi bác ơi!");
    }
  };

  // Gom nhóm ghế theo hàng để vẽ giao diện
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
    acc[seat.seatRow].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(groupedSeats).sort();

  // Tính tổng tiền phụ thu để show cho khách xem
  const totalSurcharge = selectedSeats.reduce((sum, s) => sum + s.surcharge + price, 0);

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial" }}>
      <h2 style={{ color: "#333" }}>🎬 CHỌN GHẾ NGỒI</h2>

      <div
        style={{
          background: "#333",
          color: "#fff",
          padding: "10px",
          marginBottom: "40px",
          borderRadius: "4px",
        }}
      >
        MÀN HÌNH
      </div>

      {/* VẼ SƠ ĐỒ GHẾ */}
      <div>
        {sortedRows.map((row) => (
          <div
            key={row}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div style={{ width: "30px", fontWeight: "bold" }}>{row}</div>

            <div style={{ display: "flex", gap: "8px" }}>
              {groupedSeats[row]
                .sort((a, b) => a.seatNumber - b.seatNumber)
                .map((seat) => {
                  // KIỂM TRA TRẠNG THÁI ĐỂ TÔ MÀU
                  const isSelected = selectedSeats.some(
                    (s) => s.id === seat.id,
                  );
                  let bgColor = "#fff";
                  let cursor = "pointer";

                  if (seat.booked) {
                    bgColor = "#ccc";
                    cursor = "not-allowed";
                  } else if (isSelected) {
                    bgColor = "#4CAF50"; // Màu xanh khi chọn
                  } else if (seat.type === "VIP") {
                    bgColor = "#f5a623";
                  } else if (seat.type === "SWEETBOX") {
                    bgColor = "#e91e63";
                  }

                  return (
                    <div
                      key={seat.id}
                      onClick={() => handleSelectSeat(seat)}
                      style={{
                        width: seat.type === "SWEETBOX" ? "85px" : "40px",
                        height: "40px",
                        border: "1px solid #999",
                        borderRadius: "6px",
                        backgroundColor: bgColor,
                        cursor: cursor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      {seat.seatRow}
                      {seat.seatNumber}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* TỔNG KẾT VÀ XÁC NHẬN */}
      {selectedSeats.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "2px solid #e50914",
            borderRadius: "10px",
            backgroundColor: "#fff",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>
            Ghế đã chọn:{" "}
            {selectedSeats.map((s) => `${s.seatRow}${s.seatNumber}`).join(", ")}
          </h3>
          <p style={{ fontSize: "18px" }}>
            Giá Vé:{" "}
            <strong style={{ color: "red" }}>
              {totalSurcharge.toLocaleString()} VNĐ
            </strong>
          </p>

          <button
            style={{
              padding: "12px 40px",
              background: "#e50914",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
            onClick={handleBooking}
          >
            XÁC NHẬN ĐẶT {selectedSeats.length} VÉ
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatPage;
