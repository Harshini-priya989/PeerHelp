import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard/feed":        return "Feed";
      case "/dashboard/mytasks":     return "My Tasks";
      case "/dashboard/requests":    return "Requests";
      case "/dashboard/myrequests":  return "My Requests";
      case "/dashboard/addtask":     return "Add Task";
      case "/dashboard/settings":    return "Settings";
      case "/dashboard/requestform": return "Send Request";
      default:                       return "Dashboard";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="header">
      <span className="header-title">{getTitle()}</span>
      <div className="header-right">
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
