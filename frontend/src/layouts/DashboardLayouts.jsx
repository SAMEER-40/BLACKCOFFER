// src/layouts/DashboardLayout.jsx
import Sidebar from "../contents/Sidebar"

const DashboardLayout = ({ children }) => { 
    return (
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-y-auto bg-gray-100">
            {children}
        </div>
    </div>
)
}

export default DashboardLayout
