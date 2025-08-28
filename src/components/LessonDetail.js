import { ArrowLeft, Clock, FileText, Play } from "lucide-react";
import { useEffect, useState } from "react";
import Comments from "./Comment";
import { apiClient, endpoints } from "../configs/Apis";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { wait } from "@testing-library/user-event/dist/utils";

// Main LessonDetail Component
const LessonDetail = () => {
    const [lessonDetail, setLessonDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const { lessonId } = useParams();
    const [course, setCourse] = useState(null);
    const nav = useNavigate();
    const location = useLocation();

    const lesson = location.state?.lesson;

    useEffect(() => {
        const fetchLessonDetail = async () => {
            setLoading(true);

            try {
                const res = await apiClient().get(endpoints['get-lesson-detail'](lessonId))
                console.log("Data: ", res.data.metadata);
                setLessonDetail(res.data.metadata);
                setLoading(false);

            } catch (err) {
                console.error("Error to fetch lesson detail: ", err);
            }
            console.log("Lesson state in LessonDetail: ", lesson);
        };
        const fetchCourse = async () => {
            try {

                const res = await apiClient().get(endpoints['get-coures-by-lesson-id'](lessonId))
                setCourse(res.data);
                console.log("Courses  by lesson id: ", res.data);
            } catch (err) {
                console.error("Failed to fetch course info ", err)
            }
        }

        fetchCourse();
        fetchLessonDetail();
    }, [lessonId]);

    const handleBack = () => {
        console.log('Navigate back');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    const downloadPDF = async (pdfUrl, fileName = 'tailieu.pdf') => {
        try {
            const response = await fetch(pdfUrl);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="px-6 py-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Quay lại danh sách bài học</span>
                    </button>
                    {/* <h1 className="text-2xl font-bold text-gray-800">{lesson.title}</h1> */}
                </div>
            </div>

            <div className="flex h-[calc(100vh-120px)]">
                <div className="w-2/3 flex flex-col bg-white pl-3 pr-3">
                    {/* Video Player */}
                    <div className="bg-black">
                        <div className="aspect-video bg-gray-900 flex items-center justify-center">
                            {lessonDetail?.video_url ? (
                                <video
                                    controls
                                    className="w-full h-full"
                                    poster="/api/placeholder/800/450"
                                >
                                    <source src={lessonDetail.video_url} type="video/mp4" />
                                    Trình duyệt của bạn không hỗ trợ video.
                                </video>
                            ) : (
                                <div className="text-white text-center">
                                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>Video đang được cập nhật</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="p-6">
                        {lessonDetail?.pdf_url && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-blue-900 mb-2">Tài liệu</h3>
                                <button
                                    onClick={() => downloadPDF(lessonDetail.pdf_url, `tai-lieu-${lessonDetail.title}.pdf`)}
                                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Tải tài liệu PDF</span>
                                </button>
                            </div>
                        )}

                        {/* <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3">Về bài học này</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Trong bài học "{lesson.title}", bạn sẽ tìm hiểu về những khái niệm quan trọng
                                và thực hành với các ví dụ cụ thể. Đây là kiến thức nền tảng giúp bạn xây dựng
                                nên sự hiểu biết vững chắc cho các bài học tiếp theo.
                            </p>
                        </div> */}
                    </div>
                </div>

                {/* Right Side - Comments */}
                <div className="w-1/3 bg-white border-l overflow-y-auto">
                    <Comments data={course} />
                </div>
            </div>
        </div>
    );
};

export default LessonDetail;