import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Result, Spin } from 'antd';
import { apiClient, endpoints } from '../configs/Apis';
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';

const PaymentResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchPaymentResult = async () => {
            try {
                const urlParams = new URLSearchParams(location.search);
                const responseCode = urlParams.get('vnp_ResponseCode');

                setPaymentStatus(responseCode === '00' ? 'success' : 'fail');
                setLoading(false);
            } catch (err) {
                setPaymentStatus('fail');
                setErrorMessage(
                    err.response?.data?.message || 'Có lỗi khi xử lý kết quả thanh toán'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentResult();
    }, [location]);

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleViewMyCourses = () => {
        navigate('/my-courses');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="text-center p-8">
                    <Spin size="large" />
                    <p className="mt-4 text-gray-600">Đang xử lý kết quả thanh toán...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <Card>
                    {paymentStatus === 'success' ? (
                        <Result
                            icon={<CheckCircle2Icon className="w-16 h-16 text-green-500 mx-auto" />}
                            status="success"
                            title="Thanh toán thành công!"
                            subTitle="Bạn đã thanh toán thành công. Khóa học đã được thêm vào tài khoản của bạn."
                            extra={[
                                <Button type="primary" key="courses" onClick={handleViewMyCourses}>
                                    Xem khóa học của tôi
                                </Button>,
                                <Button key="home" onClick={handleBackToHome}>
                                    Về trang chủ
                                </Button>
                            ]}
                        />
                    ) : (
                        <Result
                            icon={<XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />}
                            status="error"
                            title="Thanh toán thất bại"
                            subTitle={errorMessage}
                            extra={[
                                <Button type="primary" key="retry" onClick={handleBackToHome}>
                                    Thử lại
                                </Button>,
                                <Button key="home" onClick={handleBackToHome}>
                                    Về trang chủ
                                </Button>
                            ]}
                        />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default PaymentResult;
