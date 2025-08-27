import React, { useEffect, useState } from 'react';
import { Card, Spin, Typography } from 'antd';
import { apiClient, endpoints } from '../configs/Apis';
import CourseCard from './CourseCard';
import { useLocation } from 'react-router-dom';

const { Title } = Typography;

const HomePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query") || "";

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true)
            try {
                let res;
                if (query) {
                    // Gọi API search
                    res = await apiClient().get(`${endpoints['search-courses']}?query=${encodeURIComponent(query)}`);
                } else {
                    // Gọi API tất cả
                    res = await apiClient().get(endpoints['get-all-courses']);
                }
                setCourses(res.data);
            } catch (err) {
                console.error("Lỗi khi fetch courses:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [query]);

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
                {query ? `Kết quả cho: "${query}"` : "Đề xuất khóa học"}
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
                    <p style={{ color: "Red" }}>Chưa có khóa học nào</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;