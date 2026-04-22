import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "text-black font-semibold" : "text-gray-500";

  return (
    <div className="flex justify-between items-center px-10 py-4 border-b bg-white">

      <h1 className="text-lg font-semibold">CredVerify</h1>

      <div className="flex gap-8">
        <Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
        <Link to="/profile" className={isActive("/profile")}>Profile</Link>
        <Link to="/notifications" className={isActive("/notifications")}>
          Notifications <span className="text-red-500 text-sm">(3)</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
          JD
        </div>
        <button className="text-gray-600">Logout</button>
      </div>

    </div>
  );
};

export default Navbar;