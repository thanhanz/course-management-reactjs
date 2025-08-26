import React, { useContext, useEffect, useState } from "react";
import { Card, Spin, Typography, Row, Col, Empty } from "antd";
import { apiClient, endpoints } from "../configs/Apis";
import { useNavigate } from "react-router-dom";
import { MyCourseContext } from "../configs/MyCoursesContext";

const { Title, Paragraph } = Typography;

const MyCourses = () => {
    
    const nav = useNavigate();
   
    const { myCourses, loading } = useContext(MyCourseContext);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spin size="large" />
            </div>
        );
    }

    const formatPrice = (price) => {
        if (!price) return 'Miễn phí';
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    };


    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>Các khóa học của tôi</Title>

            {myCourses.length === 0 ? (
                <Empty description="Bạn chưa đăng ký khóa học nào." />
            ) : (
                <Row gutter={[16, 16]}>
                    {myCourses.map((course) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={course.course_id}>
                            <Card
                                onClick={() => nav(`/course/${course.course_id}`)}
                                hoverable
                                cover={
                                    <img
                                        alt={course.title}
                                        src={course.thumbnail}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                }
                            >
                                <Card.Meta
                                    title={course.title
                                    }
                                    description={
                                        <>
                                            <Paragraph ellipsis={{ rows: 2 }}>
                                                {course.description
                                                }
                                            </Paragraph>
                                            <div className="text-black">
                                                <p>
                                                    Giảng viên: <b>{course.lecturer}</b>
                                                </p>
                                                <p> Giá: {formatPrice(course.price)} VNĐ</p>
                                            </div>
                                        </>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default MyCourses;
