import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Todo() {
  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  const getTodos = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/todos`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setTodos(response.data.todos);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingId) {
        response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/todos/${editingId}`,
          formData,
          {
            withCredentials: true,
          },
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/todos`,
          formData,
          {
            withCredentials: true,
          },
        );
      }

      if (response.data.success) {
        alert(response.data.message);

        setFormData({
          title: "",
          description: "",
        });

        setEditingId(null);

        await getTodos();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/todos/${id}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        alert(response.data.message);

        await getTodos();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo._id);

    setFormData({
      title: todo.title,
      description: todo.description,
    });
  };

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

  useEffect(() => {
    getTodos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-semibold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between border-b pb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">MERN Todo App</h1>

            <p className="mt-2 text-gray-600">
              Welcome,
              <span className="font-semibold text-blue-600">{user?.name}</span>
            </p>

            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Todo List */}
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <div>
              <label className="block mb-2 font-medium">Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter todo title"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer"
            >
              {editingId ? "Update Todo" : "Add Todo"}
            </button>
          </form>
          <h2 className="text-2xl font-semibold mb-5">My Todos</h2>

          {todos.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No todos found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todos.map((todo) => (
                <div key={todo._id} className="border rounded-lg p-5 shadow-sm">
                  <h3 className="text-xl font-semibold">{todo.title}</h3>

                  <p className="text-gray-600 mt-2">{todo.description}</p>

                  <p className="mt-3">
                    Status:
                    <span
                      className={`ml-2 font-medium ${
                        todo.completed ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {todo.completed ? "Completed" : "Pending"}
                    </span>
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Todo;
