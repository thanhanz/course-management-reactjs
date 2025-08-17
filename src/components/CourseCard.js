import React, { useEffect, useState } from 'react';
import { Card, Spin, Typography } from 'antd';
import { apiClient, endpoints } from '../configs/Apis';

const { Text, Title } = Typography;

const formatPrice = (price) => {
    if (!price) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
};


const CourseCard = ({ course }) => {
    return (
        <Card
            hoverable
            className="course-card"
            style={{
                backgroundColor: '#111827',
                border: '1px solid #1f2937',
                width: '260px',
                borderRadius: '8px',
                overflow: 'hidden'
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
                />
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Course Name */}
                <Title
                    level={5}
                    style={{
                        color: 'white',
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

                {/* Lecture Name */}
                <Text style={{ color: '#9ca3af', fontSize: '13px' }}>
                    {course.lecture}
                </Text>

                {/* Short Description */}
                <Text
                    style={{
                        color: '#d1d5db',
                        fontSize: '13px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {course.desc}
                </Text>

                {/* Price */}
                <div style={{ marginTop: '6px', marginLeft: '130px' }}>
                    <Text
                        strong
                        style={{
                            color: '#facc15',
                            fontSize: '15px',
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

const HomePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await apiClient().get(endpoints['get-all-courses']);
                setCourses(res.data);
            } catch (err) {
                console.error("Lỗi khi fetch courses:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, []);
    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', minHeight: '100vh' }}>
            <Title level={2} style={{ marginBottom: '24px' }}>
                Đề xuất khóa học
            </Title>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                }}
            >
                {courses.length > 0 ? (
                    courses.map((c) => <CourseCard key={c.id} course={c} />)
                ) : (
                    <p style={{ color: "white" }}>Chưa có khóa học nào</p>
                )}
            </div>
        </div>
    );
};

export { CourseCard, HomePage };