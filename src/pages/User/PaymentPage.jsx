import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import api from "../../service/api";

const PaymentPage = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lấy thông tin hóa đơn mới nhất (đã cộng tiền combo)
        api.get(`/user/invoices/${invoiceId}`).then(res => {
            setInvoice(res.data);
            setLoading(false);
        });
    }, [invoiceId]);

    const handleFakeSuccess = async () => {
        try {
            // Gọi API Backend để đổi status thành CONFIRMED
            await api.post(`/user/invoices/${invoiceId}/confirm-payment`);
            alert("Thanh toán thành công! Chúc bác xem phim vui vẻ.");
            navigate("/profile"); // Quay lại trang lịch sử để xem QR vé
        } catch (e) {
            alert("Có lỗi khi xác nhận thanh toán!");
        }
    };

    if (loading) return <div className="p-20 text-center">Đang khởi tạo giao dịch...</div>;

    return (
        <div className="min-h-screen bg-slate-900 py-10 px-4 flex items-center justify-center font-sans">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-red-600 p-8 text-center text-white">
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-2">Cổng thanh toán Cinemax</p>
                    <h2 className="text-4xl font-black">
                        {new Intl.NumberFormat("vi-VN").format(invoice)}đ
                    </h2>
                </div>

                <div className="p-8 flex flex-col items-center">
                    <p className="text-slate-500 text-sm mb-6 text-center">
                        Quét mã QR dưới đây bằng ứng dụng Ngân hàng hoặc Ví điện tử để thanh toán cho hóa đơn <strong>#{invoiceId}</strong>
                    </p>

                    {/* QR CODE - Cháu giả lập nội dung VietQR */}
                    <div className="bg-white p-4 border-8 border-slate-50 rounded-[32px] shadow-inner mb-8">
                        <QRCodeSVG 
                            value={`00020101021138570010A00000072701270006970423011312345678901230208QRIBFTTA5303704540${invoice.totalPrice}5802VN62070803${invoiceId}`} 
                            size={220} 
                        />
                    </div>

                    <div className="w-full space-y-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400 uppercase font-bold">Nội dung chuyển khoản</span>
                                <span className="text-blue-600 font-bold">Sao chép</span>
                            </div>
                            <p className="font-mono font-bold text-slate-800 tracking-wider">CINEMA-PLUS-DTK{invoiceId}</p>
                        </div>

                        {/* Nút này để giả lập việc Bank gửi callback về cho mình */}
                        <button 
                            onClick={handleFakeSuccess}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
                        >
                            XÁC NHẬN ĐÃ CHUYỂN KHOẢN
                        </button>

                        <button 
                            onClick={() => navigate("/profile")}
                            className="w-full text-slate-400 text-sm font-bold hover:text-slate-600"
                        >
                            Quay lại và hủy giao dịch
                        </button>
                    </div>
                </div>
                
                <div className="bg-slate-50 p-4 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold italic">Giao dịch an toàn bảo mật bởi VNPAY Sandbox</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;