import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Flame,
  Award,
  MessageSquare,
} from "lucide-react";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const touchStartX = useRef(0);
  const isSwiping = useRef(false);

  useEffect(() => {
    fetchMovies();
    fetchTopMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await api.get("/public/movies");
      setMovies(response.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách phim:", error);
    }
  };

  const fetchTopMovies = async () => {
    try {
      const response = await api.get("/public/movies/top-movies");
      setTopMovies(response.data);
    } catch (error) {
      console.error("Lỗi lấy top movies:", error);
    }
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === topMovies.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? topMovies.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = false;
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    if (Math.abs(touchStartX.current - currentX) > 10) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;

    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white pb-24 font-sans overflow-x-hidden animate-fadeIn">
      <div className="text-center pt-16 space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-widest">
          <Award size={12} /> Bảng Xếp Hạng Phòng Vé
        </div>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(245,197,24,0.2)]">
          Top Doanh Thu Thịnh Hành
        </h2>
      </div>

      <div className="relative h-[600px] flex items-center justify-center mt-6 group/carousel">
        <button
          onClick={handlePrev}
          className="absolute left-6 md:left-12 z-40 bg-zinc-900/60 border border-white/5 text-white w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 hover:bg-amber-500 hover:text-black hover:border-amber-500 hover:scale-110 transition-all duration-300 shadow-2xl"
          aria-label="Phim trước"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>

        <div
          className="relative w-full max-w-[1200px] h-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {topMovies.map((movie, index) => {
            let position = index - activeIndex;

            if (index === 0 && activeIndex === topMovies.length - 1)
              position = 1;
            if (index === topMovies.length - 1 && activeIndex === 0)
              position = -1;

            const isActive = position === 0;
            const isVisible = Math.abs(position) <= 1;

            return (
              <div
                key={movie.id}
                onClick={(e) => {
                  if (isSwiping.current) return;
                  if (isActive) {
                    e.stopPropagation();
                    navigate(`/movie/${movie.id}`);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                className="absolute w-[300px] md:w-[340px] h-[500px] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
                style={{
                  transform: `translateX(${position * 380}px) scale(${isActive ? 1.08 : 0.82})`,
                  opacity: isVisible ? (isActive ? 1 : 0.4) : 0,
                  zIndex: isActive ? 20 : 10,
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                <div
                  className={`absolute -left-12 -top-6 text-[130px] font-black italic select-none transition-all duration-500 z-0 ${isActive
                    ? "text-amber-500 filter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] scale-110"
                    : "text-white/5"
                    }`}
                  style={{ WebkitTextStroke: isActive ? "2px #000" : "none" }}
                >
                  {index + 1}
                </div>

                <div
                  className={`w-full h-full rounded-[35px] overflow-hidden relative transition-all duration-500 bg-zinc-900 z-10 select-none ${isActive
                    ? "shadow-[0_30px_60px_-15px_rgba(245,197,24,0.3)] border-2 border-amber-500 scale-100"
                    : "shadow-2xl border border-white/5 scale-95 pointer-events-none"
                    }`}
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
                    className="w-full h-full object-cover pointer-events-none aspect-[2/3]"
                  />

                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pt-32 pb-6 px-6 text-center space-y-3 animate-fadeIn">
                      <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight uppercase">
                        {movie.title}
                      </h3>

                      <div className="flex items-center justify-center gap-1.5">
                        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl text-amber-400 text-xs font-black shadow-sm">
                          <Star
                            size={12}
                            className="fill-amber-400 text-amber-400"
                          />
                          <span>
                            {movie.avgRating
                              ? movie.avgRating.toFixed(1)
                              : "10.0"}{" "}
                            / 10
                          </span>
                        </div>
                        {movie.duration && (
                          <span className="text-[10px] bg-zinc-800 px-2.5 py-1 rounded-lg text-zinc-400 font-bold">
                            {movie.duration} phút
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="absolute right-6 md:right-12 z-40 bg-zinc-900/60 border border-white/5 text-white w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 hover:bg-amber-500 hover:text-black hover:border-amber-500 hover:scale-110 transition-all duration-300 shadow-2xl"
          aria-label="Phim tiếp theo"
        >
          <ChevronRight size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto mt-24 px-4 md:px-8 flex items-center justify-between border-b border-zinc-900 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-2.5 text-rose-500 italic">
            <Flame
              size={24}
              className="text-rose-500 fill-rose-500/20 animate-pulse"
            />{" "}
            Phim Đang Chiếu Rạp
          </h2>
          <div className="w-16 h-1 bg-rose-600 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.5)]"></div>
        </div>
        <button
          onClick={() => navigate("/all-movies")}
          className="text-xs font-black tracking-widest text-zinc-500 hover:text-white uppercase transition-colors flex items-center gap-1 group"
        >
          Xem tất cả{" "}
          <ChevronRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>

      <div className="max-w-7xl mx-auto mt-10 px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {movies.slice(0, 4).map((movie) => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="bg-zinc-900/30 border border-zinc-900 rounded-[30px] overflow-hidden hover:border-rose-600/50 hover:-translate-y-3 transition-all duration-400 cursor-pointer group shadow-xl flex flex-col"
          >
            <div className="w-full h-[360px] overflow-hidden relative">
              {/* ĐÃ NÂNG CẤP CHECK KHÁNG LẶP LINK Ở ĐÂY CHO BÁC */}
              <img
                src={
                  movie.posterUrl
                    ? (movie.posterUrl.startsWith("http")
                      ? movie.posterUrl
                      : `https://image.tmdb.org/t/p/w500${movie.posterUrl}`)
                    : "https://via.placeholder.com/400x600"
                }
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 aspect-[2/3]"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
                <div className="bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-amber-400 text-[10px] font-black flex items-center gap-1 border border-white/5 shadow-md">
                  <Star size={10} className="fill-amber-400 text-amber-400" />
                  {movie.avgRating ? movie.avgRating.toFixed(1) : "10.0"}
                </div>
                <div className="bg-zinc-950/80 backdrop-blur-md px-2 py-1 rounded-xl text-zinc-400 text-[9px] font-black flex items-center gap-1 border border-white/5 shadow-md">
                  <MessageSquare size={9} />
                  {movie.commentCount || 0}
                </div>
              </div>
            </div>

            <div className="p-5 text-center space-y-4 flex-1 flex flex-col justify-between">
              <h4 className="font-black text-white text-base tracking-tight uppercase line-clamp-2 h-12 flex items-center justify-center">
                {movie.title}
              </h4>
              <button className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-colors shadow-lg shadow-rose-600/10 active:scale-95">
                Mua vé ngay bác ơi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;