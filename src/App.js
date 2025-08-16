
import { MyUserContext } from './configs/MyContext';
import { apiClient, endpoints } from './configs/Apis';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Layout/Header';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          const res = await apiClient().get(endpoints['current-user']);
          setUser(res.data.user);
        }
      } catch (err) {
        setUser(null);
      }
    };

    currentUser();
  }, []);

  return (
    <MyUserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </MyUserContext.Provider>
  );
}

export default App;
