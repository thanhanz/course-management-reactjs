import React, { useEffect, useState, useRef } from 'react'
import QuestionCard from './QuestionCard'
import ResultModal from './ExamResultModal'
import { useParams } from 'react-router-dom'
import { apiClient, endpoints } from '../configs/Apis';

function ExamPage() {
    const { chapterId } = useParams();
    const [exam, setExam] = useState(null)
    const [answers, setAnswers] = useState({}) // {question_id: choice_id}
    const [timeLeft, setTimeLeft] = useState(null)
    const timerRef = useRef(null)
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState(null)

    useEffect(() => {
        async function loadExam() {
            try {
                const res = await apiClient().get(endpoints['get-exam-by-chapter-id'](chapterId));
                if (res.data.success) {
                    const examData = res.data.data
                    setExam(examData)
                    setTimeLeft(examData.time_limit ? examData.time_limit * 60 : null)

                    const ansRes = await apiClient().get(endpoints['get-user-answers'](examData.exam_id))
                    console.log("Answered: ", ansRes.data.data)
                    if (ansRes.data.success) {
                        const restored = {}
                        ansRes.data.questions.forEach(q => {
                            const selectedChoice = q.choices.find(c => c.selected)
                            if (selectedChoice) {
                                restored[q.question_id] = selectedChoice.choice_id
                            }
                        })
                        setAnswers(restored)
                    }
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadExam()
    }, [chapterId])

    useEffect(() => {
        if (timeLeft == null) return
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t === 1) {
                    clearInterval(timerRef.current)
                    handleSubmit()
                }
                return t - 1
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
    }, [timeLeft])

    function handleSelect(questionId, choiceId) {
        setAnswers(prev => ({ ...prev, [questionId]: choiceId }))
    }

    async function handleSubmit() {
        if (!exam) return
        const payload = {
            answers: Object.keys(answers).map(qid => ({
                question_id: parseInt(qid),
                choice_id: answers[qid]
            }))
        }

        console.log("Send to BE: ", payload);
        try {
            const res = await apiClient().post(endpoints['submit-exam'](exam.exam_id), payload)
            if (res.data.success) {
                setResult(res.data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div>Loading...</div>
    if (!exam) return <div>Không có đề cho chương này</div>

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold">{exam.title}</h2>
            {timeLeft !== null && (
                <div>
                    Thời gian còn lại: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
            )}

            <div className="space-y-4 mt-4">
                {exam.questions.map(q => (
                    <QuestionCard
                        key={q.question_id}
                        question={q}
                        selected={answers[q.question_id]} // khôi phục đáp án
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    className="px-4 py-2 rounded bg-blue-600 text-white"
                    onClick={handleSubmit}
                >
                    Nộp bài
                </button>
                <button
                    className="px-4 py-2 rounded border"
                    onClick={() =>
                        window.confirm('Chắc chắn thoát?') && window.history.back()
                    }
                >
                    Thoát
                </button>
            </div>

            {result && <ResultModal result={result} onClose={() => setResult(null)} />}
        </div>
    )
}

export default ExamPage
