import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
    fetchTopMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await api.get("/public/movies");
      setMovies(response.data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const fetchTopMovies = async () => {
    try {
      const response = await api.get("/public/movies/top-movies");
      setTopMovies(response.data);
    } catch (error) {
      console.error("Lỗi top movies:", error);
    }
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === topMovies.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? topMovies.length - 1 : prev - 1));
  };

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "80px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ================= PHẦN 1: TOP THỊNH HÀNH (VÒNG TRÒN + ĐÁNH SỐ) ================= */}
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <h2
          style={{
            color: "#f5c518",
            fontSize: "32px",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "4px",
            textShadow: "0 0 15px rgba(245, 197, 24, 0.5)",
          }}
        >
          🏆 TOP DOANH THU PHÒNG VÉ 🏆
        </h2>
      </div>

      <div
        style={{
          position: "relative",
          height: "550px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginTop: "30px",
        }}
      >
        {/* NÚT PREVIOUS (Bên trái) */}
        <button
          onClick={handlePrev}
          style={{ ...navButtonStyle, left: "50px" }}
          onMouseOver={(e) =>
            (e.target.style.background = "rgba(245, 197, 24, 0.8)")
          }
          onMouseOut={(e) =>
            (e.target.style.background = "rgba(255,255,255,0.1)")
          }
        >
          {" "}
          ❮{" "}
        </button>

        {/* Carousel Container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1100px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {topMovies.map((movie, index) => {
            let position = index - activeIndex;

            // Logic xoay vòng
            if (index === 0 && activeIndex === topMovies.length - 1)
              position = 1;
            if (index === topMovies.length - 1 && activeIndex === 0)
              position = -1;

            const isActive = position === 0;
            const isVisible = Math.abs(position) <= 1;

            return (
              <div
                key={movie.id}
                onClick={() =>
                  isActive
                    ? navigate(`/movie/${movie.id}`)
                    : setActiveIndex(index)
                }
                style={{
                  position: "absolute",
                  width: "320px",
                  height: "480px",
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: `translateX(${position * 380}px) scale(${isActive ? 1.15 : 0.85})`,
                  opacity: isVisible ? (isActive ? 1 : 0.5) : 0,
                  zIndex: isActive ? 10 : 5,
                  cursor: "pointer",
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                {/* SỐ THỨ TỰ (#1, #2...) - Đẳng cấp nằm ở đây bác nhé */}
                <div
                  style={{
                    position: "absolute",
                    left: "-50px",
                    top: "10px",
                    fontSize: "120px",
                    fontWeight: "900",
                    color: isActive ? "#f5c518" : "rgba(255,255,255,0.1)",
                    zIndex: -1,
                    fontStyle: "italic",
                    WebkitTextStroke: isActive ? "2px #000" : "none",
                    textShadow: isActive
                      ? "5px 5px 0px rgba(0,0,0,0.5)"
                      : "none",
                    transition: "0.6s",
                  }}
                >
                  {index + 1}
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "25px",
                    overflow: "hidden",
                    boxShadow: isActive
                      ? "0 25px 50px rgba(245, 197, 24, 0.4)"
                      : "0 10px 20px rgba(0,0,0,0.5)",
                    border: isActive
                      ? "3px solid #f5c518"
                      : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <img
                    src={
                      movie.posterUrl
                        ? `https://image.tmdb.org/t/p/w500${movie.posterUrl}`
                        : "https://via.placeholder.com/300x450"
                    }
                    alt={movie.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.95))",
                        padding: "40px 15px 20px",
                        textAlign: "center",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "22px",
                          fontWeight: "bold",
                          color: "#fff",
                          textShadow: "2px 2px 4px #000",
                        }}
                      >
                        {movie.title}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* NÚT NEXT (Bên phải) */}
        <button
          onClick={handleNext}
          style={{ ...navButtonStyle, right: "50px" }}
          onMouseOver={(e) =>
            (e.target.style.background = "rgba(245, 197, 24, 0.8)")
          }
          onMouseOut={(e) =>
            (e.target.style.background = "rgba(255,255,255,0.1)")
          }
        >
          {" "}
          ❯{" "}
        </button>
      </div>

      {/* ================= PHẦN 2: PHIM ĐANG CHIẾU ================= */}
      <div
        style={{
          maxWidth: "1250px",
          margin: "100px auto 30px",
          padding: "0 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h2
            style={{
              color: "#e50914",
              margin: 0,
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            🔥 PHIM ĐANG CHIẾU
          </h2>
          <div
            style={{
              width: "80px",
              height: "5px",
              background: "#e50914",
              marginTop: "10px",
              borderRadius: "2px",
            }}
          ></div>
        </div>
        <span
          onClick={() => navigate("/all-movies")}
          style={{
            cursor: "pointer",
            color: "#aaa",
            fontSize: "15px",
            fontWeight: "bold",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.color = "#fff")}
          onMouseOut={(e) => (e.target.style.color = "#aaa")}
        >
          XEM TẤT CẢ ❯
        </span>
      </div>

      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "40px",
          padding: "0 30px",
        }}
      >
        {movies.slice(0, 4).map((movie) => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            style={{
              background: "#161616",
              borderRadius: "20px",
              overflow: "hidden",
              transition: "0.4s",
              cursor: "pointer",
              border: "1px solid #222",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-15px)";
              e.currentTarget.style.borderColor = "#e50914";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#222";
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w400${movie.posterUrl}`}
              alt={movie.title}
              style={{ width: "100%", height: "380px", objectFit: "cover" }}
            />
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h4
                style={{
                  fontSize: "18px",
                  marginBottom: "15px",
                  height: "45px",
                  overflow: "hidden",
                  fontWeight: "600",
                }}
              >
                {movie.title}
              </h4>
              <button
                style={{
                  background: "#e50914",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  width: "100%",
                  fontSize: "15px",
                  boxShadow: "0 4px 15px rgba(229, 9, 20, 0.3)",
                }}
              >
                MUA VÉ NGAY
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const navButtonStyle = {
  position: "absolute",
  zIndex: 100,
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "white",
  width: "65px",
  height: "65px",
  borderRadius: "50%",
  fontSize: "28px",
  cursor: "pointer",
  backdropFilter: "blur(15px)",
  transition: "0.4s",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
};

export default HomePage;
