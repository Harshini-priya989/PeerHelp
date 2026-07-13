import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
function Dashboard() {
  return (
    <div className="dashboard-wrapper">
        <Header/>
        <Sidebar/>
        <div className="main-content"><Outlet/></div>
    </div>
  )
}

export default Dashboard;