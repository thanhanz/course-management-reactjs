import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, Row, Col, Divider, Modal, message } from 'antd';
import { ArrowLeftIcon, CreditCardIcon } from 'lucide-react';
import { apiClient, endpoints } from '../configs/Apis';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

const CheckoutPage = () => {
    const [loading, setLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const location = useLocation();
    const nav = useNavigate();
    const { backPath } = location.state || {};
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);

    const handleBack = () => nav(backPath || '/');


    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                const res = await apiClient().get(endpoints['get-course-by-id'](courseId));
                setCourse(res.data);
                console.log("Course for payment: ", res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch course: ", err);
                setLoading(true);
            }
        }

        if (courseId)
            fetchCourseDetail();

    }, [courseId]);

    const handlePayment = async () => {
        setLoading(true);

        try {
            const res = await apiClient().post(endpoints['create-payment-url'](course.id))
            console.log("Res is:", res);
            if (res.data.paymentUrl) {
                window.location.href = res.data.paymentUrl;
            } else {
                message.error(res.message || 'Có lỗi xảy ra khi tạo thanh toán');
                setLoading(false);
            }
        } catch (err) {
            console.error("Fail to create payment url: ", err);
        }

    };

    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN') + ' VNĐ';
    };

    if (loading || !course) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
        </div>
    );
}
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        type="text"
                        icon={<ArrowLeftIcon className="w-4 h-4" />}
                        onClick={handleBack}
                        className="mb-4"
                    >
                        Quay lại
                    </Button>
                    <Title level={2} className="text-gray-800">Thanh toán đơn hàng</Title>
                </div>

                <Row gutter={24}>
                    {/* Thông tin khóa học */}
                    <Col xs={24} lg={16}>
                        <Card title="Thông tin khóa học" className="mb-6">
                            <div className="flex gap-4">
                                <img
                                    src={course.thumbnail || 'https://via.placeholder.com/120x80.png?text=No+Image'}
                                    alt={course.name}
                                    className="w-30 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <Title level={4} className="mb-2">{course.name}</Title>
                                    <Text className="text-gray-600 block mb-1">
                                        Giảng viên: {course.lecture}
                                    </Text>
                                    <Text className="text-gray-500 text-sm">
                                        {course.desc}
                                    </Text>
                                </div>
                            </div>
                        </Card>

                        {/* Thông tin thanh toán */}
                        <Card title="Phương thức thanh toán">
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4 bg-blue-50">
                                    <div className="flex items-center gap-3">
                                        <CreditCardIcon className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <Text strong>Thanh toán online</Text>
                                            <br />
                                            <Text className="text-sm text-gray-600">
                                                VNPAY
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* Tóm tắt đơn hàng */}
                    <Col xs={24} lg={8}>
                        <Card title="Tóm tắt đơn hàng" className="sticky top-4">
                            <div className="space-y-4">
                                {/* Chi tiết giá */}
                                <div className="flex justify-between">
                                    <Text>Giá khóa học:</Text>
                                    <Text>{formatPrice(course.price)}</Text>
                                </div>
                                <Divider className="my-4" />

                                {/* Tổng cộng */}
                                <div className="flex justify-between items-center">
                                    <Text strong className="text-lg">Tổng cộng:</Text>
                                    <Text strong className="text-xl text-red-600">
                                        {formatPrice(course.price)}
                                    </Text>
                                </div>

                                <Divider className="my-4" />

                                {/* Nút thanh toán */}
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    loading={loading}
                                    onClick={() => setShowPaymentModal(true)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 border-none h-12"
                                >
                                    <CreditCardIcon className="w-5 h-5 mr-2" />
                                    Thanh toán {formatPrice(course.price)}
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Modal xác nhận thanh toán */}
                <Modal
                    title="Xác nhận thanh toán"
                    open={showPaymentModal}
                    onCancel={() => setShowPaymentModal(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setShowPaymentModal(false)}>
                            Hủy
                        </Button>,
                        <Button
                            key="confirm"
                            type="primary"
                            loading={loading}
                            onClick={handlePayment}
                        >
                            Xác nhận thanh toán
                        </Button>
                    ]}
                >
                    <div className="py-4">
                        <Text>Bạn có chắc chắn muốn thanh toán khóa học:</Text>
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                            <Text strong>{course.name}</Text>
                            <br />
                            <Text className="text-red-600 text-lg">
                                Tổng tiền: {formatPrice(course.price)}
                            </Text>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default CheckoutPage;