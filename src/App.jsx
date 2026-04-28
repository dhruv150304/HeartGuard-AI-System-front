import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Login from "./pages/Login";
import Prediction from "./pages/Prediction";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  if (!user) {
    return <Login onLogin={(nextUser) => setUser(nextUser)} />;
  }

  if (user.role === "doctor") {
    return <DoctorDashboard onLogout={() => setUser(null)} />;
  }

  if (page === "prediction") {
    return <Prediction onBack={() => setPage("dashboard")} />;
  }

  return <Dashboard onNewPrediction={() => setPage("prediction")} />;
}
