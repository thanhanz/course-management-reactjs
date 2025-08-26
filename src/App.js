
import { CartProvider, MyUserContext } from './configs/MyContext';
import { apiClient, endpoints } from './configs/Apis';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Layout/Header';
import CourseDetail from './components/CourseDetail';
import LessonDetail from './components/LessonDetail';
import HomePage from './components/HomePage';
import CheckoutPage from './components/CheckoutPage';
import PaymentResult from './components/PaymentResult';
import PrivateRoutes from './components/PrivateRoutes';
import { MyCourseProvider } from './configs/MyCoursesContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const fetchUser = async () => {
        try {
          const res = await apiClient().get(endpoints['current-user']);
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (err) {
          setUser(null);
        }
      };
      fetchUser();
    }
  }, [setUser]);

  return (
    <MyUserContext.Provider value={{ user, setUser }}>
      <MyCourseProvider>
        <CartProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path='/' element={<HomePage />} />
              <Route path='/course/:courseId' element={<CourseDetail />} />
              <Route path='/*' element={<PrivateRoutes />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </MyCourseProvider>
    </MyUserContext.Provider>
  );
}

export default App;
