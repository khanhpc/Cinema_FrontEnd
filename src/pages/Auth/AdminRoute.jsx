import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const role = localStorage.getItem('role');

    if (role === 'ADMIN') {
        return children;
    }

    alert("Bác không có quyền vào đây đâu nhé.");
    return <Navigate to="/" replace />;
};

export default AdminRoute;