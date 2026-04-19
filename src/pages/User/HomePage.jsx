import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../service/api';

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // Gọi API public vừa tạo
                const response = await api.get('/public/movies');
                setMovies(response.data);
            } catch (error) {
                console.error("Lỗi lấy danh sách phim:", error);
            }
        };
        fetchMovies();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
                🔥 PHIM ĐANG CHIẾU
            </h2>

            {/* Dạng lưới Grid: Tự động xuống hàng, mỗi thẻ rộng 200px */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '25px' 
            }}>
                {movies.map(movie => (
                    <div 
                        key={movie.id} 
                        style={{ 
                            background: 'white', borderRadius: '10px', overflow: 'hidden', 
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column'
                        }}
                        // Bấm vào thẻ phim sẽ nhảy sang trang chọn giờ chiếu của đúng phim đó
                        onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                        <img 
                            src={movie.posterUrl ? `https://image.tmdb.org/t/p/w300${movie.posterUrl}` : 'https://via.placeholder.com/300x450'} 
                            alt={movie.title} 
                            style={{ width: '100%', height: '300px', objectFit: 'cover', transition: 'transform 0.3s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        <div style={{ padding: '15px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <h3 style={{ fontSize: '16px', margin: '0 0 10px 0', color: '#e50914' }}>{movie.title}</h3>
                            <button style={{ 
                                width: '100%', background: '#e50914', color: 'white', 
                                border: 'none', padding: '10px', borderRadius: '5px', 
                                fontWeight: 'bold', cursor: 'pointer' 
                            }}>
                                MUA VÉ
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;