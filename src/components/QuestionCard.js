import React from 'react'

export default function QuestionCard({ question, selected, onSelect }) {
    return (
        <div className="p-4 border rounded">
            <div className="font-medium">{question.content}</div>
            <div className="mt-2 grid gap-2">
                {question.answers.map(a => (
                    <label key={a.choice_id} className={`p-2 rounded cursor-pointer border ${selected === a.choice_id ? 'bg-gray-100' : ''}`}>
                        <input type="radio" name={`q-${question.question_id}`} value={a.choice_id} checked={selected === a.choice_id} onChange={() => onSelect(question.question_id, a.choice_id)} />
                        <span className="ml-2">{a.content}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}