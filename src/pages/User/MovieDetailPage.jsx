import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../service/api";
import { MoveLeft, Ticket, Play, Clock, Calendar, Info } from "lucide-react";

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    api.get(`/public/movies/${movieId}`).then((res) => setMovie(res.data));
    window.scrollTo(0, 0);
  }, [movieId]);

  if (!movie)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* NÚT QUAY LẠI */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-6 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-all text-xs font-bold"
      >
        <MoveLeft size={16} /> Quay lại
      </button>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {/* 1. PHẦN TRAILER - ĐÃ THU NHỎ & CĂN GIỮA */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)] border border-white/5 bg-black">
            <iframe
              className="w-full h-full"
              // Cháu bỏ mute=1 để có tiếng, thêm rel=0 để không hiện video gợi ý cuối phim
              src={`https://www.youtube.com/embed/${movie.trailerUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={movie.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* 2. THÔNG TIN CHI TIẾT PHIM */}
        <div className="flex flex-col md:flex-row gap-12 items-start bg-white/[0.02] backdrop-blur-sm p-8 md:p-12 rounded-[3rem] border border-white/5">
          {/* Poster bên trái */}
          <div className="w-full max-w-[240px] mx-auto md:mx-0 shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.posterUrl}`}
              alt={movie.title}
              className="w-full rounded-3xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Nội dung bên phải */}
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight italic bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-black text-slate-400">
                <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-white/5">
                  <Clock size={14} className="text-red-600" /> {movie.duration}{" "}
                  PHÚT
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-white/5">
                  <Calendar size={14} className="text-red-600" />{" "}
                  {new Date(movie.releaseDate).getFullYear()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-red-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Info size={16} /> Cốt truyện
              </h3>
              <p className="text-slate-400 leading-relaxed text-lg font-light">
                {movie.description || "Nội dung đang được cập nhật..."}
              </p>
            </div>

            {/* NÚT ĐẶT VÉ - DẪN SANG TRANG KHÁC */}
            <div className="pt-6">
              <button
                onClick={() => navigate(`/movie/${movieId}/showtimes`)}
                className="group relative flex items-center gap-4 bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-[0_15px_30px_rgba(220,38,38,0.2)] active:scale-95"
              >
                <Ticket className="group-hover:rotate-12 transition-transform" />
                <span>XEM LỊCH CHIẾU & ĐẶT VÉ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BACKGROUND BLUR NGHỆ THUẬT */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.posterUrl}`}
          className="w-full h-full object-cover blur-[100px] opacity-20"
          alt="bg"
        />
        <div className="absolute inset-0 bg-slate-950/80"></div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
