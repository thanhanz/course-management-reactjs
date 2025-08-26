import React, { useEffect, useState } from 'react';
import { Card, Spin, Typography } from 'antd';
import { apiClient, endpoints } from '../configs/Apis';
import CourseCard from './CourseCard';
import Title from 'antd/es/skeleton/Title';

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

export default HomePage;