import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCartFromStorage, 
  addToCart as addToCartUtil, 
  removeFromCart as removeFromCartUtil,
  clearCart,
  getCartCount,
  getCartTotal
} from "../utils/cartUtils";


export const MyUserContext = createContext();
export const MyDispatcherContext = createContext()

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCart = getCartFromStorage();
    setCart(savedCart);
    setCartCount(savedCart.length);
  }, []);

  const addToCart = (course) => {
    const success = addToCartUtil(course);
    if (success) {
      const updatedCart = getCartFromStorage();
      setCart(updatedCart);
      setCartCount(updatedCart.length);
      
      alert('Đã thêm khóa học vào giỏ hàng!');
    }
  };

  const removeFromCart = (courseId) => {
    const updatedCart = removeFromCartUtil(courseId);
    setCart(updatedCart);
    setCartCount(updatedCart.length);
  };

  const clearAllCart = () => {
    clearCart();
    setCart([]);
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartCount, 
      addToCart, 
      removeFromCart, 
      clearAllCart,
      getCartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};