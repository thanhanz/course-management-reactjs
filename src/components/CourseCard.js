import React, { useEffect, useState } from 'react';
import { Button, Card, Spin, Typography } from 'antd';
import { apiClient, endpoints } from '../configs/Apis';
import { Icon, ShoppingCartIcon } from 'lucide-react';
import { useCart } from '../configs/MyContext';
import { useNavigate } from 'react-router-dom';


const { Text, Title } = Typography;

const formatPrice = (price) => {
    if (!price) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
};

const CourseCard = ({ course }) => {
    const { addToCart } = useCart()
    const handleAddToCart = () => {
        addToCart(course);
    };

    const nav = useNavigate();
    return (
        <Card
            hoverable
            className="course-card"
            style={{
                backgroundColor: '#ffffff',
                border: '1px solid #1f2937',
                width: '280px',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
            cover={
                <img
                    alt={course.course_name}
                    src={course.thumbnail || 'https://via.placeholder.com/260x150.png?text=No+Thumbnail'}
                    style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover'
                    }}
                    onClick={() => nav(`/course/${course.id}`)}
                />
            }
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%' ,

                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Title
                        level={5}
                        style={{
                            margin: 0,
                            fontSize: '15px',
                            fontWeight: 600,
                            lineHeight: '20px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {course.name}
                    </Title>

                    <Text style={{ color: '#bd1d35ff', fontSize: '13px' }}>
                      Giảng viên:  {course.lecture}
                    </Text>

                    <Text
                        style={{
                            color: '#080809ff',
                            fontSize: '13px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {course.desc}
                    </Text>
                </div>

                <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                        type="primary"
                        shape="round"
                        icon={<ShoppingCartIcon />}
                        onClick={handleAddToCart}
                    />
                    <Text
                        strong
                        style={{
                            color: '#facc15',
                            fontSize: '15px'
                        }}
                    >
                        {formatPrice(course.price)}
                    </Text>
                </div>
            </div>
            <style jsx>{`
        .course-card:hover img {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }
      `}</style>
        </Card>
    );
};

export default CourseCard;