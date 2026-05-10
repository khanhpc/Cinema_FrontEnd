import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    Swal.fire({
      title: "Xác nhận đăng xuất",
      text: "Bác có chắc muốn đăng xuất không?",
      icon: "warning",
      background: "#1a1a1a",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#e50914",
      cancelButtonColor: "#333",
      confirmButtonText: "Đăng xuất ngay",
      cancelButtonText: "Ở lại",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
        Swal.fire({
          title: "Đã đăng xuất!",
          text: "Hẹn gặp lại bác nhé.",
          icon: "success",
          background: "#1a1a1a",
          color: "#fff",
          confirmButtonColor: "#e50914",
        });
      }
    });
  };

  // Logic kiểm tra Tab đang hoạt động
  const isHomeActive =
    location.pathname === "/" ||
    location.pathname.includes("/movie") ||
    location.pathname.includes("/all-movies") ||
    location.pathname.includes("/seats");
  const isProfileActive = location.pathname.includes("/profile");

  const navLinkStyle = (isActive) => ({
    padding: "15px 25px",
    textDecoration: "none",
    fontWeight: "800",
    fontSize: "13px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: isActive ? "#e50914" : "#999",
    borderBottom: isActive ? "3px solid #e50914" : "3px solid transparent",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 1. HEADER HAI TẦNG (FIXED) */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "rgba(10, 10, 10, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* TẦNG 1: LOGO & AUTH BUTTON */}
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              height: "70px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 20px",
            }}
          >
            {/* Logo bên trái */}
            <Link
              to="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  background: "#e50914",
                  color: "white",
                  width: "35px",
                  height: "35px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                  fontSize: "18px",
                  boxShadow: "0 0 15px rgba(229, 9, 20, 0.4)",
                }}
              >
                C+
              </div>
              <span
                style={{
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "900",
                  letterSpacing: "1.5px",
                }}
              >
                CINEMA PLUS
              </span>
            </Link>

            {/* Nút Đăng nhập/Đăng xuất bên phải */}
            <div>
              {token ? (
                <button
                  onClick={handleLogout}
                  style={{
                    background: "transparent",
                    color: "#bbb",
                    border: "1px solid #333",
                    padding: "8px 18px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "12px",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = "#fff";
                    e.target.style.borderColor = "#e50914";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = "#bbb";
                    e.target.style.borderColor = "#333";
                  }}
                >
                  ĐĂNG XUẤT
                </button>
              ) : (
                <Link
                  to="/login"
                  style={{
                    background: "#e50914",
                    color: "white",
                    textDecoration: "none",
                    padding: "8px 22px",
                    borderRadius: "10px",
                    fontWeight: "900",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(229, 9, 20, 0.2)",
                  }}
                >
                  ĐĂNG NHẬP
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* TẦNG 2: NAVIGATION MENU (XUỐNG HÀNG) */}
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
        >
          <nav style={{ display: "flex", gap: "5px" }}>
            <Link to="/" style={navLinkStyle(isHomeActive)}>
              <span style={{ fontSize: "16px" }}>🍿</span> Lịch chiếu
            </Link>

            {token && (
              <Link to="/profile" style={navLinkStyle(isProfileActive)}>
                <span style={{ fontSize: "16px" }}>🎟️</span> Vé của tôi
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* 2. VÙNG NỘI DUNG CHÍNH */}
      <main style={{ flex: 1 }}>
        <div
          key={location.pathname}
          style={{ animation: "fadeIn 0.4s ease-out" }}
        >
          <Outlet />
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer
        style={{
          background: "#080808",
          padding: "50px 20px",
          borderTop: "1px solid rgba(255,255,255,0.03)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h3
            style={{
              color: "#e50914",
              fontWeight: "900",
              fontSize: "18px",
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            CINEMA PLUS
          </h3>
          <p style={{ color: "#444", fontSize: "12px", margin: "5px 0" }}>
            Đặt vé xem phim online nhanh chóng và tiện lợi.
          </p>
          <div
            style={{
              width: "30px",
              height: "2px",
              background: "#333",
              margin: "20px auto",
            }}
          ></div>
          <p style={{ color: "#222", fontSize: "11px", fontWeight: "bold" }}>
            © {new Date().getFullYear()} KHANHDTK PRODUCTION.
          </p>
        </div>
      </footer>

      {/* Style bổ sung */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #0a0a0a; }
          ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #e50914; }

          /* Loại bỏ gạch chân mặc định của Link */
          a { transition: color 0.3s ease; }
        `}
      </style>
    </div>
  );
};

export default UserLayout;
