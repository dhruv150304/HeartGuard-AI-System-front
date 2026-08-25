import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Login from "./pages/Login";
import Prediction from "./pages/Prediction";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

function SetupRequired() {
  return <main className="grid min-h-screen place-items-center bg-[#FDF8F3] p-6"><section className="max-w-lg rounded-2xl bg-white p-8 shadow-sm"><h1 className="font-playfair text-3xl font-bold">Configuration required</h1><p className="mt-4 leading-7 text-stone-600">Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to the frontend environment before running CardioSense.</p></section></main>;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    async function loadSession(nextSession) {
      setSession(nextSession);
      if (!nextSession) { setProfile(null); setLoading(false); return; }
      const { data, error } = await supabase.from("profiles").select("id, full_name, role").eq("id", nextSession.user.id).single();
      setProfile(error ? null : data);
      setLoading(false);
    }
    supabase.auth.getSession().then(({ data }) => loadSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => loadSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) return <SetupRequired />;
  if (loading) return <main className="grid min-h-screen place-items-center bg-[#FDF8F3] text-stone-500">Loading secure session…</main>;
  if (!session) return <Login />;
  if (!profile) return <main className="grid min-h-screen place-items-center bg-[#FDF8F3] p-6"><p className="max-w-md rounded-xl bg-red-50 p-5 text-red-800">Your account profile could not be loaded. Contact your clinic administrator if this continues.</p></main>;

  const logout = () => supabase.auth.signOut();
  if (profile.role === "doctor" || profile.role === "clinic_admin") return <DoctorDashboard onLogout={logout} />;
  if (page === "prediction") return <Prediction accessToken={session.access_token} onBack={() => setPage("dashboard")} />;
  return <Dashboard accessToken={session.access_token} onNewPrediction={() => setPage("prediction")} onLogout={logout} />;
}
