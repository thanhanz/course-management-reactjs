import { useContext, useEffect } from "react";
import { MyUserContext } from "../configs/MyContext";
import Header from "./Layout/Header";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LessonDetail from "./LessonDetail";
import PaymentResult from "./PaymentResult";
import MyCourses from "./MyCourses";
import { MyCourseProvider } from "../configs/MyCoursesContext";
import CheckoutPage from "./CheckoutPage";
import ExamPage from "./ExamPage";

const PrivateRoutes = () => {
    const { user } = useContext(MyUserContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
                <Routes>
                    <Route path='/lesson/:lessonId' element={<LessonDetail />} />
                    <Route path='/payment-result' element={<PaymentResult />} />
                    <Route path='/checkout/:courseId' element={<CheckoutPage/>}/>
                    <Route path="/my-courses" element={<MyCourses />} />
                    <Route path="/exam/:chapterId" element={<ExamPage />}/>
                </Routes>
        </>
    );
};

export default PrivateRoutes;