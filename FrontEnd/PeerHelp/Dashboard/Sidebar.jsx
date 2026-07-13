import { NavLink } from 'react-router-dom'
function Sidebar() {
  return (
    <nav className="sidebar">
        <NavLink className={({isActive}) => "sidebar-link" + (isActive ? " active" : "")} to="/dashboard/feed">Feed</NavLink>
        <NavLink className={({isActive}) => "sidebar-link" + (isActive ? " active" : "")} to="/dashboard/mytasks">My Tasks</NavLink>
        <NavLink className={({isActive}) => "sidebar-link" + (isActive ? " active" : "")} to="/dashboard/requests">Requests</NavLink>
        <NavLink className={({isActive}) => "sidebar-link" + (isActive ? " active" : "")} to="/dashboard/myrequests">My Requests</NavLink>
        <NavLink className={({isActive}) => "sidebar-link" + (isActive ? " active" : "")} to="/dashboard/addtask">Add Task</NavLink>
        <NavLink className={({isActive}) => "sidebar-link" + (isActive ? " active" : "")} to="/dashboard/settings">Settings</NavLink>
    </nav>
  )
}

export default Sidebar;