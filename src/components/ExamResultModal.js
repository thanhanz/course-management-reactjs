import React from "react";

const ResultModal = ({ result, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Kết quả kiểm tra</h2>
                <p>
                    Điểm: <span className="font-semibold">{result.score}</span>
                </p>
                <p>
                    Đúng {result.correct}/{result.total}
                </p>
                {result.unlocked_next ? (
                    <p className="text-green-600 mt-2 font-medium">
                        Bạn đã mở khóa chương tiếp theo!
                    </p>
                ) : (
                    <p className="text-red-600 mt-2 font-medium">
                        Chưa đủ điểm để mở khóa, hãy thử lại nhé!
                    </p>
                )}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
