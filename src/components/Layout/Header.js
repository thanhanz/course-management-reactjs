import { useContext, useState } from "react";
import { apiClient, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/MyContext";

const Header = () => {
  const { user, setUser } = useContext(MyUserContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await apiClient().post(endpoints['logout']);
      setUser(null);
      localStorage.removeItem("user");
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setShowDropdown(false);
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Bankhoahoc.com</h1>
        
        {user && (
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
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;