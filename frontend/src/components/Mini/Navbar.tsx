import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth";

export default function Navbar() {
  const { user, clear, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const logout = () => {
    clear();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-slate-50 px-4 py-2">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold">
          Form Builder
        </Link>

        {isAuthenticated() && (
          <ul className="flex gap-2">
            <Link to="/">
              <li className="p-2 hover:underline cursor-pointer">My Forms</li>
            </Link>
            <Link to="/builder">
              <li className="p-2 hover:underline cursor-pointer">New Form</li>
            </Link>
          </ul>
        )}
      </div>

      {isAuthenticated() ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {user?.name || user?.email}
          </span>
          <button
            type="button"
            onClick={logout}
            className="bg-transparent text-gray-700 border border-gray-400 hover:bg-gray-100 font-semibold py-1 px-3 rounded-md cursor-pointer"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/login">
            <button
              type="button"
              className="bg-transparent text-gray-700 hover:bg-gray-100 font-semibold py-1 px-3 rounded-md cursor-pointer"
            >
              Sign in
            </button>
          </Link>
          <Link to="/register">
            <button
              type="button"
              className="bg-blue-700 hover:bg-blue-900 text-white font-semibold py-1 px-3 rounded-md cursor-pointer"
            >
              Sign up
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
