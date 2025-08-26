const CART_KEY = 'shopping_cart';

// Lấy giỏ hàng từ localStorage
export const getCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem(CART_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

// Lưu giỏ hàng vào localStorage
export const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Thêm khóa học vào giỏ hàng
export const addToCart = (course) => {
  const currentCart = getCartFromStorage();
  
  // Kiểm tra xem khóa học đã có trong giỏ hàng chưa
  const existingCourse = currentCart.find(item => item.id === course.id);
  
  if (existingCourse) {
    alert('Khóa học này đã có trong giỏ hàng!');
    return false;
  }
  
  const updatedCart = [...currentCart, { ...course, addedAt: Date.now() }];
  saveCartToStorage(updatedCart);
  return true;
};

// Xóa khóa học khỏi giỏ hàng
export const removeFromCart = (courseId) => {
  const currentCart = getCartFromStorage();
  const updatedCart = currentCart.filter(item => item.id !== courseId);
  saveCartToStorage(updatedCart);
  return updatedCart;
};

// Xóa toàn bộ giỏ hàng
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};

// Đếm số lượng khóa học trong giỏ
export const getCartCount = () => {
  return getCartFromStorage().length;
};

// Tính tổng tiền
export const getCartTotal = () => {
  const cart = getCartFromStorage();
  return cart.reduce((total, course) => total + (course.price || 0), 0);
};