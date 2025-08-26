import { useEffect, useState } from "react";
import { apiClient, endpoints } from "../configs/Apis";
import { Avatar } from "antd";

const Comments = ({ lessonId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTexts, setReplyTexts] = useState({});
    const [showReplyForm, setShowReplyForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAllComments, setShowAllComments] = useState(false);
    const [collapsedReplies, setCollapsedReplies] = useState({});
    const [loadingReplies, setLoadingReplies] = useState({});

    // Fetch root comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);

                const response = await apiClient().get(endpoints['get-root-comments'](lessonId));

                const initialCollapsedState = {};
                response.data.forEach(comment => {
                    if (comment.replies_count > 0) {
                        initialCollapsedState[comment.id] = true;
                    }
                });

                setCollapsedReplies(initialCollapsedState);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
                setComments([]);
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) {
            fetchComments();
        }
    }, [lessonId]);

    const fetchReplies = async (commentId) => {
        try {
            setLoadingReplies(prev => ({ ...prev, [commentId]: true }));
            const response = await apiClient().get(endpoints['get-replies'](commentId));

            // Update the comment with its replies
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId
                        ? { ...comment, replies: response.data }
                        : comment
                )
            );

            setCollapsedReplies(prev => ({ ...prev, [commentId]: false }));
        } catch (error) {
            console.error('Error fetching replies:', error);
        } finally {
            setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {

            const response = await apiClient().post(endpoints["get-root-comments"](lessonId), {
                content: newComment
            });

            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const findCommentAndUpdate = (comments, targetId, newReply) => {
        return comments.map(comment => {
            if (comment.id === targetId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply],
                    replies_count: comment.replies_count + 1
                };
            } else if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: findCommentAndUpdate(comment.replies, targetId, newReply)
                };
            }
            return comment;
        });
    };

    const handleAddReply = async (parent_comment_id) => {
        const replyText = replyTexts[parent_comment_id];
        if (!replyText?.trim()) return;

        try {

            const response = await apiClient().post(endpoints['get-root-comments'](lessonId), {
                content: replyText,
                parent_comment_id: parent_comment_id,
            });

            setComments(findCommentAndUpdate(comments, parent_comment_id, response.data));
        } catch (error) {
            console.error('Error adding reply:', error);
        }

        setReplyTexts({ ...replyTexts, [parent_comment_id]: '' });
        setShowReplyForm({ ...showReplyForm, [parent_comment_id]: false });
    };

    const toggleReplyForm = (id) => {
        setShowReplyForm({ ...showReplyForm, [id]: !showReplyForm[id] });
    };

    const toggleRepliesVisibility = (commentId) => {
        if (collapsedReplies[commentId]) {
            // If collapsed, fetch and show replies
            fetchReplies(commentId);
        } else {
            // If expanded, collapse
            setCollapsedReplies(prev => ({ ...prev, [commentId]: true }));
        }
    };

    const renderReplies = (replies, level = 0) => {
        if (!replies || replies.length === 0) return null;

        return (
            <div className={`${level === 0 ? 'ml-8' : 'ml-6'} mt-4 space-y-3`}>
                {replies.map((reply) => (
                    <div key={reply.id} className="border-l-2 border-gray-100 pl-4">
                        <div className="flex items-start space-x-3">
                            <Avatar 
                                shape="circle"
                                size={30}
                                src ={"https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg"}
                            />
                         
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 flex-wrap">
                                    <h5 className={`font-medium text-sm ${reply.role == 'lecturer' ? 'text-green-600' : 'text-gray-800'}`}>
                                        {reply.author}
                                        {reply.role == 'lecturer' && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">Giảng viên</span>}
                                    </h5>
                                    {reply.replyTo && (
                                        <span className="text-xs text-gray-500">
                                            trả lời <span className="font-medium">{reply.replyTo}</span>
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-500">{reply.time}</span>
                                </div>
                                <p className="text-gray-700 text-sm mt-1 leading-relaxed break-words">{reply.content}</p>
                                <button
                                    onClick={() => toggleReplyForm(reply.id)}
                                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                >
                                    Trả lời
                                </button>

                                {/* Reply Form for nested reply */}
                                {showReplyForm[reply.id] && (
                                    <div className="mt-2">
                                        <textarea
                                            value={replyTexts[reply.id] || ''}
                                            onChange={(e) => setReplyTexts({ ...replyTexts, [reply.id]: e.target.value })}
                                            className="w-full p-2 text-sm border border-gray-300 rounded resize-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                            rows="2"
                                            placeholder={`Trả lời ${reply.author}...`}
                                        ></textarea>
                                        <div className="flex space-x-2 mt-2">
                                            <button
                                                onClick={() => handleAddReply(reply.parent_comment_id)}
                                                disabled={!replyTexts[reply.id]?.trim()}
                                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-400"
                                            >
                                                Gửi
                                            </button>
                                            <button
                                                onClick={() => toggleReplyForm(reply.id)}
                                                className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Render nested replies */}
                                {renderReplies(reply.replies, level + 1)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const getTotalCommentsCount = (comments) => {
        return comments.reduce((total, comment) => {
            const repliesCount = comment.replies ? getTotalCommentsCount(comment.replies) : comment.replies_count || 0;
            return total + 1 + repliesCount;
        }, 0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 border">
            <h2 className="text-xl font-semibold mb-4">
                Thảo luận ({getTotalCommentsCount(comments)})
            </h2>

            {/* Comment Form */}
            <div className="mb-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Viết bình luận hoặc đặt câu hỏi..."
                ></textarea>
                <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                    Gửi bình luận
                </button>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-start space-x-3">
                            <Avatar 
                                shape="circle"
                                size={30}
                                src ={"https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg"}
                            /><div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 flex-wrap">
                                    <h4 className={`font-medium ${comment.role == 'lecturer' ? 'text-green-600' : 'text-gray-800'}`}>
                                        {comment.author}
                                        {comment.role == 'lecturer' && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">Giảng viên</span>}
                                    </h4>
                                    <span className="text-xs text-gray-500">{comment.time}</span>
                                </div>
                                <p className="text-gray-700 mt-1 leading-relaxed break-words">{comment.content}</p>

                                <div className="flex items-center space-x-4 mt-2">
                                    <button
                                        onClick={() => toggleReplyForm(comment.id)}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Trả lời
                                    </button>

                                    {comment.replies_count > 0 && (
                                        <button
                                            onClick={() => toggleRepliesVisibility(comment.id)}
                                            disabled={loadingReplies[comment.id]}
                                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                                        >
                                            {loadingReplies[comment.id] ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-600"></div>
                                                    <span>Đang tải...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>
                                                        {collapsedReplies[comment.id] ? 'Xem' : 'Ẩn'} {comment.replies_count} bình luận
                                                    </span>
                                                    <svg
                                                        className={`w-3 h-3 transition-transform ${collapsedReplies[comment.id] ? '' : 'rotate-180'}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Reply Form */}
                                {showReplyForm[comment.id] && (
                                    <div className="mt-3">
                                        <textarea
                                            value={replyTexts[comment.id] || ''}
                                            onChange={(e) => setReplyTexts({ ...replyTexts, [comment.id]: e.target.value })}
                                            className="w-full p-2 text-sm border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows="2"
                                            placeholder={`Trả lời ${comment.author}...`}
                                        ></textarea>
                                        <div className="flex space-x-2 mt-2">
                                            <button
                                                onClick={() => handleAddReply(comment.id)}
                                                disabled={!replyTexts[comment.id]?.trim()}
                                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
                                            >
                                                Gửi
                                            </button>
                                            <button
                                                onClick={() => toggleReplyForm(comment.id)}
                                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Render Replies - only show if not collapsed */}
                                {!collapsedReplies[comment.id] && renderReplies(comment.replies)}
                            </div>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comments;
