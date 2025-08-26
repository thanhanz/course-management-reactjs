import { useContext, useState } from "react";
import { apiClient, endpoints } from "../../configs/Apis";
import { MyUserContext, useCart } from "../../configs/MyContext";
import { Badge, Button, Drawer } from "antd";
import { ShoppingCartIcon, Text } from "lucide-react";
import CheckoutPage from "../CheckoutPage";
import { Navigate, useNavigate } from "react-router-dom";

const Header = () => {
  const { user, setUser } = useContext(MyUserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const { cart, cartCount, removeFromCart, clearAllCart, getCartTotal, checkoutSingleCourse } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const nav = useNavigate()

  const handleLogout = async () => {
    try {
      await apiClient().post(endpoints['logout']);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("shopping_cart")
      setUser(null);
      setShowDropdown(false);
      nav("/");
    }
  };
  const handleBackToCart = () => {
    nav("/")
    setSelectedCourse(null);
    setShowCart(true);
  };

  const handleCheckoutCourse = (course) => {
    setSelectedCourse(course);
    setShowCart(false);
    nav(`/checkout/${course.id}`, {
     state: { backPath: '/'}
    })
  };

  const formatPrice = (price) => {
    if (!price) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  // if (showCheckout && selectedCourse) {
  //   return (
  //     <CheckoutPage
  //       course={selectedCourse}
  //       onBack={handleBackToCart}
  //     // onPaymentSuccess={handlePaymentSuccess}
  //     />
  //   );
  // }

  return (
    <>
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Bankhoahoc.com</h1>

          <div className="flex items-center gap-4">


            {user ? (
              <>
                <Badge count={cartCount} showZero>
                  <Button
                    type="text"
                    icon={<ShoppingCartIcon className="w-6 h-6 text-white" />}
                    onClick={() => setShowCart(true)}
                    className="text-white hover:text-gray-200"
                  />
                </Badge>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 bg-blue-700 px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <span>Xin chào, {user.display_name || user.email}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                      <button
                        onClick={() => nav("/my-courses")}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                      >
                        Khóa học của tôi
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => nav("/login")}
                className="flex items-center space-x-2 bg-yellow-700 px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Drawer hiển thị giỏ hàng */}
      <Drawer
        title="Giỏ hàng của bạn"
        placement="right"
        onClose={() => setShowCart(false)}
        open={showCart}
        width={400}
      >
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Giỏ hàng trống</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(course => (
              <div key={course.id} className="border p-3 rounded">
                <h4 className="font-medium">{course.name}</h4>
                <p className="text-sm text-gray-600">{course.lecture}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-yellow-500">
                    {formatPrice(course.price)}
                  </span>
                  <Button
                    size="small"
                    className="ml-20"
                    danger
                    onClick={() => removeFromCart(course.id)}
                  >
                    Xóa
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleCheckoutCourse(course)}
                  >
                    Thanh toán
                  </Button>
                </div>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t space-y-3">
              <div className="flex justify-between items-center">
                <Text strong>Tổng cộng:</Text>
                <Text strong className="text-lg text-yellow-500">
                  {getCartTotal().toLocaleString('vi-VN')} VNĐ
                </Text>
              </div>

              <div className="flex gap-2">
                <Button
                  type="default"
                  onClick={clearAllCart}
                  className="flex-1"
                >
                  Xóa tất cả
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default Header;
