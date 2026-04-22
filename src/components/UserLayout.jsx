import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    Swal.fire({
      title: 'Xác nhận đăng xuất',
      text: "Bác có chắc muốn đăng xuất không?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        // Thực hiện logic đăng xuất
        localStorage.clear();
        navigate("/login");

        Swal.fire(
          'Đã đăng xuất!',
          'Hẹn gặp lại bác nhé.',
          'success'
        );
      }
    });
  };


  const isHomeTab =
    location.pathname === "/" || location.pathname.includes("/seats");
  const isProfileTab = location.pathname.includes("/profile");

  const getTabStyle = (isActive) => ({
    flex: 1, // Chia đều không gian cho các Tab
    textAlign: "center",
    padding: "15px 0",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
    color: isActive ? "#e50914" : "#666", // Chữ đỏ nếu đang chọn
    borderBottom: isActive ? "3px solid #e50914" : "3px solid transparent", // Gạch chân đỏ
    backgroundColor: isActive ? "#fff" : "#f8f9fa",
    transition: "all 0.3s ease",
    cursor: "pointer",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Arial",
        backgroundColor: "#f0f2f5",
      }}
    >
      {/* 1. THANH HEADER (Chỉ chứa Logo và Nút Đăng nhập/Đăng xuất) */}
      <header
        style={{
          background: "#141414",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a
          style={{
            color: "#e50914",
            fontSize: "24px",
            fontWeight: "900",
            letterSpacing: "2px",
          }}
          href="/"
        >
          🎬 CINEMA PLUS
        </a>
        <div>
          {token ? (
            <button
              onClick={handleLogout}
              style={{
                background: "#333",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Đăng xuất
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                background: "#e50914",
                color: "white",
                textDecoration: "none",
                padding: "8px 20px",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              Đăng Nhập
            </Link>
          )}
        </div>
      </header>

      {/* 2. THANH TAB ĐIỀU HƯỚNG CHÍNH CỦA WEB */}
      <div
        style={{
          display: "flex",
          background: "#fff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        }}
      >
        {/* Tab 1: Đặt vé */}
        <Link to="/" style={getTabStyle(isHomeTab)}>
          🍿 ĐẶT VÉ & LỊCH CHIẾU
        </Link>

        {/* Tab 2: Lịch sử (Chỉ hiện khi đã đăng nhập) */}
        {token && (
          <Link to="/profile" style={getTabStyle(isProfileTab)}>
            🎟️ VÉ CỦA TÔI
          </Link>
        )}
      </div>

      {/* 3. VÙNG NỘI DUNG (Khúc này sẽ thay đổi khi bấm Tab) */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        <Outlet />
      </main>

      {/* 4. FOOTER */}
      <footer
        style={{
          background: "#fff",
          textAlign: "center",
          padding: "1px",
          color: "#888",
          borderTop: "1px solid #ddd",
        }}
      >
        <p style={{ margin: 0 }}>© 2026 KhanhDTK.</p>
      </footer>
    </div>
  );
};

export default UserLayout;
