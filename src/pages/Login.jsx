import { useState } from "react";
import { supabase } from "../lib/supabase";

// The selected portal changes presentation only; access remains enforced by the profile role.

export default function Login() {
  const [mode, setMode] = useState("signIn");
  const [portal, setPortal] = useState("patient");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (mode === "signUp") {
        const { error: signUpError } = await supabase.auth.signUp({
          email, password, options: { data: { full_name: fullName, role: "patient" } },
        });
        if (signUpError) throw signUpError;
        setMessage("Check your email to verify your account, then sign in.");
        setMode("signIn");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (portal === "clinician") {
          const { data: { user } } = await supabase.auth.getUser();
          const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", user.id).single();
          if (profileError || !["doctor", "clinic_admin"].includes(profile?.role)) {
            await supabase.auth.signOut();
            throw new Error("This account is not approved for clinician access. Contact your clinic administrator.");
          }
        }
      }
    } catch (authError) {
      setError(authError.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword() {
    setError("");
    if (!email) return setError("Enter your email address first.");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/` });
    if (resetError) setError(resetError.message);
    else setMessage("Password-reset instructions have been sent to your email.");
  }

  return (
    <div className="flex min-h-screen bg-[#FDF8F3]">
      <aside className="relative hidden min-h-screen flex-1 overflow-hidden bg-gradient-to-br from-[#1A0A0A] via-[#2D0D0D] to-[#1A1A2E] px-16 py-20 lg:flex lg:flex-col lg:justify-center">
        <p className="text-3xl font-bold text-white">Cardio<span className="text-red-500">Sense</span></p>
        <h1 className="mt-14 font-playfair text-6xl font-bold leading-tight text-white">Predict.<br /><span className="text-[#F0D080]">Protect.</span><br />Prevail.</h1>
        <p className="mt-6 max-w-sm text-base leading-7 text-white/60">Secure heart-health screening for patients and clinical teams.</p>
        <p className="mt-16 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Clinical decision support · Not emergency care</p>
      </aside>
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-7 shadow-sm sm:p-10">
          <h2 className="font-playfair text-4xl font-bold text-[#1A1A2E]">{mode === "signIn" ? "Welcome back" : "Create account"}</h2>
          <p className="mt-2 text-sm text-stone-500">{mode === "signIn" ? `Sign in securely to your ${portal === "clinician" ? "clinical" : "health"} dashboard.` : "Patient accounts require email verification."}</p>
          {mode === "signIn" && <div className="mt-6 grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-sm font-bold">
            <button type="button" onClick={() => { setPortal("patient"); setError(""); }} className={`rounded-lg px-3 py-2.5 transition ${portal === "patient" ? "bg-white text-red-800 shadow-sm" : "text-stone-500"}`}>Patient</button>
            <button type="button" onClick={() => { setPortal("clinician"); setError(""); }} className={`rounded-lg px-3 py-2.5 transition ${portal === "clinician" ? "bg-white text-red-800 shadow-sm" : "text-stone-500"}`}>Clinician</button>
          </div>}
          {message && <p className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>}
          {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          <div className="mt-7 space-y-4">
            {mode === "signUp" && <label className="block text-sm font-semibold text-stone-700">Full name<input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-red-500" /></label>}
            <label className="block text-sm font-semibold text-stone-700">Email address<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-red-500" placeholder="you@example.com" /></label>
            <label className="block text-sm font-semibold text-stone-700">Password<input required type="password" minLength="8" autoComplete={mode === "signIn" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-red-500" placeholder="At least 8 characters" /></label>
          </div>
          <button disabled={loading} className="mt-7 w-full rounded-xl bg-[#982016] px-5 py-3.5 text-sm font-bold text-white disabled:opacity-60">{loading ? "Please wait…" : mode === "signIn" ? `Sign in as ${portal === "clinician" ? "Clinician" : "Patient"}` : "Create patient account"}</button>
          {mode === "signIn" && <button type="button" onClick={resetPassword} className="mt-4 w-full text-sm font-semibold text-red-800">Forgot password?</button>}
          <p className="mt-7 text-center text-sm text-stone-500">{mode === "signIn" ? "New patient?" : "Already have an account?"} <button type="button" onClick={() => { setMode(mode === "signIn" ? "signUp" : "signIn"); setPortal("patient"); setError(""); setMessage(""); }} className="font-bold text-red-800">{mode === "signIn" ? "Create an account" : "Sign in"}</button></p>
          <p className="mt-6 border-t border-stone-100 pt-5 text-center text-xs leading-5 text-stone-400">Clinician accounts are created by an approved clinic administrator. Do not create a clinician account through patient registration.</p>
        </form>
      </main>
    </div>
  );
}
