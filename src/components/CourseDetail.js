import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown, ChevronRight, Play, FileText, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, endpoints } from '../configs/Apis';
import { MyCourseContext } from '../configs/MyCoursesContext';

const CourseDetail = () => {
    const [chapters, setChapters] = useState([]);
    const [lessons, setLessons] = useState({});
    const [expandedChapters, setExpandedChapters] = useState({});
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();
    const { courseId } = useParams();
    const {myCourses }= useContext(MyCourseContext);
    const isPurchased = myCourses?.some(course => course.course_id === Number(courseId));
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchChapters = async () => {
            setLoading(true);
            try {
                const res = await apiClient().get(endpoints['get-course-detail'](courseId));
                
                if (res.status === 403) {
                    alert("Bạn không có quyền truy cập khóa học này");
                    window.location.href = '/courses';
                    return;
                }
                console.log("My courses: ", myCourses);
                console.log("Is purchased: ", isPurchased);
                const apiChapters = res.data.chapters;
                setChapters(apiChapters);
                const lessonsByChapter = {};
                apiChapters.forEach(chapter => {
                    lessonsByChapter[chapter.chapter_id] = chapter.lessons || [];
                });
                setLessons(lessonsByChapter);

                if (apiChapters.length > 0) {
                    setExpandedChapters({ [apiChapters[0].chapter_id]: true });
                }
            } catch (err) {
                console.error("Fetch chapters error:", err);
            }

            setLoading(false);
        };


        const fetchCourseDetail = async () => {
            try {
                const response = await apiClient().get(endpoints['get-course-by-id'](courseId))
                setCourse(response.data);
                console.log("Course detail: ", response.data);
            } catch (err) {
                console.err("Error to fetch course detail: ", err);
            }
            setLoading(false);
        }

        fetchCourseDetail();
        fetchChapters();
    }, [courseId]);

    console.log("All lessons: ", lessons)
    const toggleChapter = (chapterId) => {
        setExpandedChapters(prev => ({
            ...prev,
            [chapterId]: !prev[chapterId]
        }));
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const handleLessonClick = (lesson) => {
        if (!isPurchased) {
            alert("Bạn chưa đăng ký khóa học này");
            return;
        }
        nav(`/lesson/${lesson.lesson_id}`, { state: { lesson } });
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.name}</h1>
                <p className="text-red-600">
                   Được tạo bởi: {course.lecture}
                </p>
                <p className="text-gray-600 mt-2">
                   {course.desc}
                </p>
                
                <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-10">Nội dung khóa học</h1>
            
                <div className="mb-3 flex items-center justify-between">

                <p className="text-gray-600">
                    {chapters.length} chương và {Object.values(lessons).flat().length} bài học
                </p>
                {!isPurchased && (
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 "
                        onClick={() => nav(`/checkout/${courseId}`, { state : { backPath: `/course/${courseId}`} })}
                    >
                        Mua khóa học này
                    </button>
                )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg">
                {chapters.map((chapter, index) => (
                    <div key={chapter.chapter_id} className={`${index !== chapters.length - 1 ? 'border-b' : ''}`}>
                        <button
                            onClick={() => toggleChapter(chapter.chapter_id)}
                            className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-3">
                                {expandedChapters[chapter.chapter_id] ? (
                                    <ChevronDown className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                )}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Chương {index + 1}: {chapter.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 flex items-center space-x-4">
                                        <span>{lessons[chapter.chapter_id]?.length || 0} bài học</span>
                                        <span className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDuration(chapter.study_quantity)}</span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </button>

                        {expandedChapters[chapter.chapter_id] && lessons[chapter.chapter_id] && (
                            <div className="bg-gray-50">
                                {lessons[chapter.chapter_id].map((lesson) => (
                                    <div
                                        key={lesson.lesson_id}
                                        onClick={() => handleLessonClick(lesson)}
                                        className="p-4 pl-12 hover:bg-gray-100 cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-500"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {lesson.completed ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Play className="w-5 h-5 text-blue-600" />
                                                )}
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{lesson.title}</h3>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                                        {lesson.study_document && (
                                                            <div className="flex items-center space-x-1">
                                                                <FileText className="w-4 h-4" />
                                                                <span>Tài liệu</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseDetail;