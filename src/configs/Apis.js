import axios from "axios";


const BASE_URL = "http://localhost:5000";

export const endpoints = {
    "login": "/login",
    "current-user":"/current-user",
    "logout": "/logout",
    "register": "/register",
    "get-all-courses": '/api/courses',
    "get-course-by-id": (course_id) => `/api/courses/${course_id}`,
    "get-course-detail": (course_id) => `/api/courses/${course_id}/chapters`,
    "get-lessons-by-chapter-id": (chapter_id) => `/api/lessons/chapters/${chapter_id}`,
    "get-lesson-detail": (lesson_id) => `/api/lessons/${lesson_id}`,
    "get-root-comments": (lesson_id) => `/api/lesson/${lesson_id}/comments`,
    "get-replies": (parent_comment_id) => `/api/comments/${parent_comment_id}/replies`,
    "create-payment-url": (course_id) => `/api/courses/${course_id}/checkout`,
    "call-back-payment": '/api/courses/checkout/webhook',
    "my-courses": '/api/courses/my-courses',
    "search-courses": `/api/courses/search`,
    "get-coures-by-lesson-id":(lesson_id) => `api/lessons/${lesson_id}/courses`,
    "get-exam-by-chapter-id": (chapter_id) => `/api/chapters/${chapter_id}/exams`,
    "submit-exam": (exam_id) => `/api/exams/${exam_id}/submit`,
    "get-user-answers": (exam_id) => `/api/exams/${exam_id}/questions`,
};

export const apiClient = () => axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Để gửi cookies nếu cần
});