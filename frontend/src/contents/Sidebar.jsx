// src/components/Sidebar.jsx
const Sidebar = () => {
    return (
        <div className="w-60 h-screen bg-gray-900 text-white p-4 space-y-4">
            <h2 className="text-xl font-bold">Blackcoffer Dashboard</h2>
            <nav className="space-y-2">
                <a href="#" className="block p-2 bg-gray-800 rounded">Dashboard</a>
                {/* Add future links here */}
            </nav>
        </div>
    )
}
export default Sidebar
