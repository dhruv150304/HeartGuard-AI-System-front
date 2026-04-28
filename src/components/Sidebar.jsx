import { useState } from "react";

export default function Sidebar({ currentPage, onNavigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "prediction", label: "Predict", icon: "🔮" },
    { id: "reports", label: "Reports", icon: "📋" },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-red-900 to-red-800 text-white transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-700">
          {isOpen && <h1 className="text-xl font-bold">HealthAI</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-red-700 rounded-lg transition-colors"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-2 px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPage === item.id
                  ? "bg-red-600 font-semibold"
                  : "hover:bg-red-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 w-full px-4">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-700 hover:bg-red-600 transition-all ${
              !isOpen && "justify-center"
            }`}
          >
            <span className="text-xl">🚪</span>
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Offset */}
      <div className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
        {/* This is just for spacing; content will be rendered here */}
      </div>
    </>
  );
}
