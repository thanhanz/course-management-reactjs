import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient, endpoints } from "../configs/Apis";

const Register = () => {
    const nav = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        display_name: '',
        phone: '',
        role: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            setLoading(false);
            return;
        }

        try {
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Mật khẩu xác nhận không khớp');
            }

            if (!formData.email || !formData.display_name || !formData.password) {
                throw new Error('Vui lòng nhập đầy đủ thông tin bắt buộc');
            }

            const res = await apiClient().post(endpoints['register'], formData);
           
            setSuccess('Đăng ký thành công! Vui lòng đăng nhập');
            setFormData({
                email: '',
                display_name: '',
                phone: '',
                password: '',
                confirmPassword: ''
            });

            setTimeout(() => {
                nav("/login");
            }, 2000);

        } catch (err) {
            setError(err.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký</h2>
                        <p className="text-gray-600 mb-6">Tạo tài khoản mới</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {success}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                id="reg-email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Tên hiển thị *
                            </label>
                            <input
                                id="display_name"
                                name="display_name"
                                type="text"
                                required
                                value={formData.display_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                Bạn là:
                            </label>
                            <select
                                id="role"
                                name="role"
                                required
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">- Chọn vai trò -</option>
                                <option value="student">Học viên</option>
                                <option value="lecturer">Giảng viên</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu *
                            </label>
                            <input
                                id="reg-password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Xác nhận mật khẩu *
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Đã có tài khoản?{' '}
                            <button
                                onClick={() => nav('/login')}
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Đăng nhập
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;