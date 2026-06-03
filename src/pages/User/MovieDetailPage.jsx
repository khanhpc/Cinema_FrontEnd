import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../service/api";
import {
  Calendar,
  Clock,
  Info,
  MessageCircle,
  MoveLeft,
  Send,
  Star,
  Ticket,
  Film,
} from "lucide-react";

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [rating, setRating] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const userEmail = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      const decoded = JSON.parse(jsonPayload);
      return decoded.sub || decoded.email || "";
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return "";
    }
  }, []);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const [movieRes, commentRes] = await Promise.all([
          api.get(`/public/movies/${movieId}`),
          api.get(`/public/movies/${movieId}/comments`),
        ]);
        setMovie(movieRes.data);
        setComments(commentRes.data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết phim:", error);
      }
    };

    fetchMovieDetail();
    window.scrollTo(0, 0);
  }, [movieId, formKey]);

  const userOldComment = useMemo(() => {
    if (!userEmail || comments.length === 0) return null;
    return comments.find((c) => c.userEmail === userEmail) || null;
  }, [comments, userEmail]);

  useEffect(() => {
    if (userOldComment) {
      setCommentContent(userOldComment.content);
      setRating(userOldComment.rating);
    } else {
      setCommentContent("");
      setRating(10);
    }
  }, [userOldComment]);

  const averageRating = useMemo(() => {
    if (comments.length === 0) return 0;
    const total = comments.reduce((sum, comment) => sum + comment.rating, 0);
    return (total / comments.length).toFixed(1);
  }, [comments]);

  const getDisplayName = (email) => {
    if (!email) return "Khách xem phim";
    return email.split("@")[0];
  };

  const formatCommentDate = (dateValue) => {
    if (!dateValue) return "";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateValue));
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();

    if (!localStorage.getItem("token")) {
      toast.error("Vui lòng đăng nhập để bình luận!");
      navigate("/login");
      return;
    }

    const content = commentContent.trim();
    if (!content) {
      toast.error("Nội dung bình luận không được để trống!");
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/user/movies/${movieId}/comments`, {
        content,
        rating,
      });

      setFormKey((prev) => prev + 1);

      toast.success(
        userOldComment
          ? "Đã cập nhật bình luận của bác!"
          : "Đã đăng tải đánh giá của bác thành công!",
        {
          style: { background: "#18181b", color: "#fff" },
        },
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Chỉ tài khoản đã đặt vé và xem phim này mới được bình luận!",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!movie)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500/20 border-t-rose-600"></div>
          <p className="text-zinc-600 font-black text-xs uppercase tracking-widest">
            Đang khởi chiếu máy chiếu...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-24 relative overflow-hidden animate-fadeIn">
      {/* NÚT QUAY LẠI */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-6 z-50 flex items-center gap-2 bg-zinc-900/60 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/5 hover:border-rose-500/50 hover:bg-zinc-900 transition-all text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-white group"
      >
        <MoveLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Quay lại
      </button>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 space-y-16 relative z-10">
        {/* ================= TỔNG QUAN PHIM ================= */}
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start bg-zinc-900/20 backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="w-full max-w-[280px] shrink-0 relative group">
            <img
              src={
                movie.posterUrl.startsWith("http")
                  ? movie.posterUrl
                  : `https://image.tmdb.org/t/p/w500${movie.posterUrl}`
              }
              alt={movie.title}
              className="w-full rounded-3xl shadow-2xl border border-white/10 group-hover:border-rose-500/50 transition-all duration-500 object-cover aspect-[2/3]"
            />
          </div>

          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent italic">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-[11px] font-black tracking-wider text-zinc-400">
                <span className="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-xl border border-white/5">
                  <Clock size={14} className="text-rose-500" /> {movie.duration}{" "}
                  PHÚT
                </span>
                <span className="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-xl border border-white/5">
                  <Calendar size={14} className="text-rose-500" />{" "}
                  {new Date(movie.releaseDate).getFullYear()}
                </span>
                {comments.length > 0 && (
                  <span className="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-xl border border-white/5 text-amber-400 shadow-lg border-amber-500/10">
                    <Star size={14} className="fill-amber-400 text-amber-400" />{" "}
                    {averageRating} / 10 ({comments.length} Đánh giá)
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.25em] flex items-center justify-center lg:justify-start gap-2">
                <Info size={14} /> Tóm tắt nội dung
              </h3>
              <p className="text-zinc-400 leading-relaxed text-base font-medium max-w-4xl">
                {movie.description ||
                  "Nội dung của bộ phim điện ảnh đang được cập nhật..."}
              </p>
            </div>

            <div className="pt-4 flex justify-center lg:justify-start">
              <button
                onClick={() => navigate(`/movie/${movieId}/showtimes`)}
                className="group relative flex items-center gap-4 bg-rose-600 hover:bg-rose-700 text-white px-10 py-5 rounded-2xl font-black text-base transition-all shadow-xl shadow-rose-600/20 active:scale-95 uppercase tracking-widest"
              >
                <Ticket
                  className="group-hover:rotate-12 transition-transform duration-300"
                  size={20}
                />
                <span>Đặt vé ngay bác ơi</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= TRAILER PHIM (ĐÃ FIX TỰ ĐỘNG CHẠY MUTE) ================= */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 pl-2">
            <Film className="text-rose-600" size={22} /> Trailer Chính Thức
          </h2>
          <div className="flex justify-center">
            <div className="w-full rounded-[35px] overflow-hidden shadow-2xl border border-zinc-800 bg-black aspect-video relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-600 z-10"></div>
              <iframe
                className="w-full h-full"
                /* CHÁU ĐÃ THÊM &autoplay=1&mute=1 ĐỂ ÉP TRÌNH DUYỆT PHÁT LUÔN KHI VÀO TRANG */
                src={`https://www.youtube.com/embed/${movie.trailerUrl}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                title={movie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* ================= BÌNH LUẬN & ĐÁNH GIÁ THANG 10 ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-1 bg-zinc-900/30 backdrop-blur-md p-6 md:p-8 rounded-[35px] border border-zinc-800 space-y-6">
            <div>
              <h2 className="text-xl font-black uppercase flex items-center gap-2">
                <MessageCircle className="text-rose-600" size={20} />
                {userOldComment ? "Cập Nhật Nhận Xét" : "Viết Nhận Xét"}
              </h2>
              <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-1.5">
                {userOldComment
                  ? "Hệ thống tự điền lại đánh giá cũ"
                  : "Chỉ dành cho tài khoản đã xem phim"}
              </p>
            </div>

            <form onSubmit={handleSubmitComment} className="space-y-5">
              {/* THANH CHỌN 10 SAO CAO CẤP */}
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                    Mức độ hài lòng
                  </span>
                  <span className="text-sm font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    ⭐ {rating} / 10 Điểm
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1 justify-items-center pt-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star
                        size={18}
                        className={
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-zinc-800"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Ô NHẬP NỘI DUNG */}
              <div className="space-y-1.5">
                <textarea
                  value={commentContent}
                  onChange={(event) => setCommentContent(event.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder={
                    userOldComment
                      ? "Nhập nội dung mới để sửa lại bình luận của bác..."
                      : "Bác thấy bộ phim này thế nào? Chia sẻ tại đây nhé..."
                  }
                  className="w-full resize-none rounded-2xl bg-zinc-950/60 border border-zinc-800 p-4 text-sm text-white outline-none focus:border-rose-500 placeholder:text-zinc-700 transition-all shadow-inner"
                />
                <div className="text-right text-[10px] text-zinc-600 font-bold">
                  {commentContent.length} / 500 ký tự
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed h-14 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
              >
                <Send size={14} />
                {submitting
                  ? "Đang gửi..."
                  : userOldComment
                    ? "Bình luận lại"
                    : "Gửi đánh giá"}
              </button>
            </form>
          </div>

          {/* HIỂN THỊ DANH SÁCH BÌNH LUẬN (PHẢI) */}
          <div className="lg:col-span-2 space-y-4 max-h-[520px] overflow-y-auto pr-2 custom-scroll">
            {comments.length === 0 ? (
              <div className="text-center py-24 text-zinc-600 font-black uppercase tracking-widest border border-dashed border-zinc-800 rounded-[35px] bg-zinc-900/5 opacity-50 italic text-sm">
                Chưa có bình luận nào từ người xem phim này bác ơi
              </div>
            ) : (
              comments.map((comment) => (
                <article
                  key={comment.id}
                  className="bg-zinc-900/20 backdrop-blur-md border border-zinc-900 hover:border-zinc-800 rounded-3xl p-6 space-y-4 transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-0 bg-rose-600 group-hover:h-full transition-all duration-300"></div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pl-2">
                    <div>
                      <h3 className="font-black text-white text-base tracking-tight flex items-center gap-2">
                        {getDisplayName(comment.userEmail)}
                        {comment.userEmail === userEmail && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 uppercase tracking-widest">
                            Bạn
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                        {formatCommentDate(comment.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-500/5 px-3 py-1.5 rounded-xl border border-amber-500/15 text-amber-400 text-xs font-black">
                      <Star size={12} className="fill-amber-400" />
                      <span>{comment.rating} / 10</span>
                    </div>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-sm font-medium pl-2">
                    {comment.content}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {/* BACKGROUND POSTER */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={
            movie.posterUrl.startsWith("http")
              ? movie.posterUrl
              : `https://image.tmdb.org/t/p/original${movie.posterUrl}`
          }
          className="w-full h-full object-cover blur-[120px] opacity-15 scale-110"
          alt="bg"
        />
        <div className="absolute inset-0 bg-zinc-950/80"></div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #e11d48; }
      `}</style>
    </div>
  );
};

export default MovieDetailPage;
