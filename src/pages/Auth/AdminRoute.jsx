import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    // Moi chức vụ từ localStorage ra kiểm tra
    const role = localStorage.getItem('role');

    // Nếu đúng là ADMIN thì cho render cái giao diện bên trong (children)
    if (role === 'ADMIN') {
        return children;
    }

    alert("Khu vực cấm! Bác không có quyền vào đây đâu nhé.");
    return <Navigate to="/" replace />;
};

export default AdminRoute;