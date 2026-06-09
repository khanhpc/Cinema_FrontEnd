import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";

const AllMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await api.get("/public/movies");
      setMovies(response.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách phim:", error);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        minHeight: "100vh",
        color: "white",
        padding: "40px 20px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Header trang */}
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "50px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h2
            style={{
              color: "#e50914",
              margin: 0,
              fontSize: "32px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            🎬 TẤT CẢ PHIM
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

        {/* Thanh tìm kiếm xịn xò */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Tìm tên phim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "12px 20px",
              paddingLeft: "45px",
              borderRadius: "30px",
              border: "1px solid #333",
              backgroundColor: "#1a1a1a",
              color: "white",
              width: "300px",
              outline: "none",
              fontSize: "16px",
              transition: "0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#e50914")}
            onBlur={(e) => (e.target.style.borderColor = "#333")}
          />
          <span
            style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#aaa",
            }}
          >
            🔍
          </span>
        </div>
      </div>

      {/* Danh sách phim dạng lưới */}
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "35px",
        }}
      >
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
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
                display: "flex",
                flexDirection: "column",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.borderColor = "#e50914";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(229, 9, 20, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#222";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: "350px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={
                    movie.posterUrl
                      ? (movie.posterUrl.startsWith("http")
                        ? movie.posterUrl
                        : `https://image.tmdb.org/t/p/w500${movie.posterUrl}`)
                      : "https://via.placeholder.com/400x600"
                  }
                  alt={movie.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <h4
                  style={{
                    fontSize: "17px",
                    marginBottom: "15px",
                    fontWeight: "600",
                    color: "#fff",
                    height: "48px",
                    overflow: "hidden",
                  }}
                >
                  {movie.title}
                </h4>
                <button
                  style={{
                    background: "#e50914",
                    color: "white",
                    border: "none",
                    padding: "10px 0",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    width: "100%",
                    fontSize: "14px",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#b20710")}
                  onMouseOut={(e) => (e.target.style.background = "#e50914")}
                >
                  MUA VÉ
                </button>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              gridColumn: "1 / -1",
              padding: "50px",
              color: "#aaa",
            }}
          >
            <h3>Không tìm thấy phim nào khớp với từ khóa của bác... 😢</h3>
          </div>
        )}
      </div>

      {/* Nút quay lại trang chủ */}
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            color: "#aaa",
            border: "1px solid #333",
            padding: "10px 30px",
            borderRadius: "30px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.3s",
          }}
          onMouseOver={(e) => {
            e.target.style.color = "#fff";
            e.target.style.borderColor = "#fff";
          }}
          onMouseOut={(e) => {
            e.target.style.color = "#aaa";
            e.target.style.borderColor = "#333";
          }}
        >
          ❮ QUAY LẠI TRANG CHỦ
        </button>
      </div>
    </div>
  );
};

export default AllMoviesPage;
