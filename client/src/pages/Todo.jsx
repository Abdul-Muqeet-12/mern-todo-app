import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Todo() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setUser(null);

        alert(response.data.message);

        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">MERN Todo App</h1>

        <p className="text-lg text-gray-600 mb-2">
          Welcome,
          <span className="font-semibold text-blue-600"> {user?.name}</span>
        </p>

        <p className="text-gray-500 mb-8">{user?.email}</p>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Todo;
