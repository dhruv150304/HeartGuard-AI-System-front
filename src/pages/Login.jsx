import { useState } from "react";

const DEMO = {
  doctor: { email: "doctor@cardiosense.io", password: "Doctor@123" },
  patient: { email: "patient@cardiosense.io", password: "Patient@123" },
};

function HeartIcon() {
  return (
    <svg width="46" height="46" viewBox="0 0 48 48" fill="none" className="anim-heartbeat shrink-0">
      <path d="M24 40S6 28.5 6 17a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 11.5-18 23-18 23z" fill="#E74C3C" />
      <polyline points="14,23 18,23 20,18 23,28 26,14 28,23 34,23" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeOpen() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function Login({ onLogin }) {
  const [role, setRole] = useState("doctor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const cfg = {
    doctor: {
      badge: "Doctor Access",
      badgeClass: "bg-red-100 text-red-900",
      btnStyle: { background: "linear-gradient(135deg,#8B0000 0%,#C0392B 100%)" },
      label: "Sign in as Doctor",
      info: "<b>Doctor access</b> includes patient management, diagnostic reports, ECG analysis, and clinical AI tools.",
    },
    patient: {
      badge: "Patient Access",
      badgeClass: "bg-blue-100 text-blue-900",
      btnStyle: { background: "linear-gradient(135deg,#0C447C 0%,#378ADD 100%)" },
      label: "Sign in as Patient",
      info: "<b>Patient access</b> lets you view your heart health summary, prediction history, and wellness tips.",
    },
  }[role];

  function handleLogin() {
    if (!email || !password) {
      setFeedback({ type: "error", text: "Please enter your email and password." });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const creds = DEMO[role];

      if (email === creds.email && password === creds.password) {
        setFeedback({ type: "success", text: "Welcome! Redirecting to your " + role + " dashboard..." });

        setTimeout(() => {
          onLogin?.({ role, email });
        }, 600);
      } else {
        setFeedback({ type: "error", text: "Incorrect credentials. Check the demo credentials below." });
      }

      setLoading(false);
    }, 900);
  }

  return (
    <div className="flex min-h-screen bg-[#FDF8F3]">
      <aside
        className="relative hidden min-h-screen flex-[1.05] overflow-hidden px-14 py-16 lg:flex lg:flex-col lg:justify-center xl:px-20"
        style={{ background: "linear-gradient(145deg,#1A0A0A 0%,#2D0D0D 45%,#1A1A2E 100%)" }}
      >
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(139,0,0,.4) 0%,transparent 70%)" }} />
        <div className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(201,168,76,.14) 0%,transparent 70%)" }} />

        <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ opacity: 0.07 }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
          <circle className="pr1" cx="280" cy="220" r="180" stroke="#8B0000" strokeWidth="1" />
          <circle className="pr2" cx="280" cy="220" r="290" stroke="#8B0000" strokeWidth=".6" />
          <circle className="pr3" cx="280" cy="220" r="400" stroke="#8B0000" strokeWidth=".3" />
          <polyline className="ecg1" points="0,820 70,820 92,755 108,890 124,715 140,905 156,820 240,820 258,788 272,852 286,762 300,820 1440,820" stroke="#C0392B" strokeWidth="1.6" fill="none" />
          <polyline className="ecg2" points="0,855 90,855 110,815 126,895 140,800 154,870 168,855 300,855 1440,855" stroke="#C9A84C" strokeWidth=".9" fill="none" style={{ opacity: 0.5 }} />
        </svg>

        <div className="relative z-10 mb-14 flex items-center gap-4 anim-fadein">
          <HeartIcon />
          <span className="font-playfair text-3xl font-bold tracking-tight text-white">
            Cardio<span className="text-red-500">Sense</span>
          </span>
        </div>

        <div className="relative z-10 anim-fadein-d">
          <h1 className="mb-6 font-playfair text-6xl font-bold leading-[1.05] tracking-tight text-white">
            Predict.<br />
            <span style={{ color: "#F0D080" }}>Protect.</span><br />
            Prevail.
          </h1>
          <p className="max-w-xs text-base font-light leading-relaxed" style={{ color: "rgba(255,255,255,.52)" }}>
            Advanced AI-driven heart disease prediction platform trusted by clinicians and patients worldwide.
          </p>
        </div>

        <div className="relative z-10 mt-16 flex gap-9">
          {[["97.4%", "Accuracy rate"], ["120K+", "Lives screened"], ["2,400+", "Cardiologists"]].map(([value, label]) => (
            <div key={label} className="min-w-32 pt-4" style={{ borderTop: "1px solid rgba(139,0,0,.4)" }}>
              <div className="font-playfair text-3xl font-bold text-white">{value}</div>
              <div className="mt-0.5 text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,.38)" }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-10 left-0 right-0 z-10 h-14 pointer-events-none" style={{ opacity: 0.38 }}>
          <svg viewBox="0 0 600 56" preserveAspectRatio="none" fill="none" className="h-full w-full">
            <polyline points="0,28 55,28 75,8 88,48 98,4 108,52 118,28 200,28 218,18 228,38 238,28 600,28" stroke="#E74C3C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-10 sm:px-8 lg:px-12" style={{ background: "#FDF8F3" }}>
        <div className="w-full max-w-lg anim-fadein">
          <h2 className="mb-1 font-playfair text-4xl font-bold" style={{ color: "#1A1A2E" }}>Welcome back</h2>
          <p className="mb-10 text-base" style={{ color: "#7A6E6E" }}>Sign in to access your heart health dashboard</p>

          <div className="mb-9 grid grid-cols-2 gap-2 rounded-2xl p-1.5" style={{ background: "#EDE8E1" }}>
            {["doctor", "patient"].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => { setRole(item); setFeedback({ type: "", text: "" }); }}
                className={"flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 " + (role === item ? "bg-white shadow-md " + (item === "doctor" ? "text-red-900" : "text-blue-900") : "bg-transparent text-stone-400")}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          <span className={"mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest " + cfg.badgeClass}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {cfg.badge}
          </span>

          {feedback.text && (
            <div className={"mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm " + (feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
              {feedback.text}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider" style={{ color: "#1A1A2E" }}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleLogin()}
              placeholder="you@hospital.org"
              className="w-full rounded-xl bg-white px-4 py-4 text-sm outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              style={{ border: "1.5px solid rgba(139,0,0,.18)", color: "#1A1A2E" }}
            />
          </div>

          <div className="mb-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider" style={{ color: "#1A1A2E" }}>Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleLogin()}
                placeholder="Enter your password"
                className="w-full rounded-xl bg-white py-4 pl-4 pr-12 text-sm outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                style={{ border: "1.5px solid rgba(139,0,0,.18)", color: "#1A1A2E" }}
              />
              <button type="button" onClick={() => setShowPwd((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-600">
                {showPwd ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>

          <div className="mb-7 text-right">
            <a href="#" className="text-xs font-semibold text-red-700 transition-colors hover:text-red-900">Forgot password?</a>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-70"
            style={cfg.btnStyle}
          >
            {loading ? "Verifying..." : cfg.label}
          </button>

          <div className="my-8 flex items-center gap-4 text-xs text-stone-400">
            <div className="h-px flex-1 bg-stone-200" /> or <div className="h-px flex-1 bg-stone-200" />
          </div>

          <div className="mb-4 flex items-start gap-3 rounded-xl p-5 text-xs leading-relaxed" style={{ background: "#F5F0EA", color: "#7A6E6E" }}>
            <span dangerouslySetInnerHTML={{ __html: cfg.info }} />
          </div>

          <div className="rounded-xl border border-dashed px-5 py-4 text-xs leading-relaxed" style={{ background: "rgba(26,26,46,.03)", borderColor: "rgba(139,0,0,.22)", color: "#7A6E6E" }}>
            <strong className="mb-1 block" style={{ color: "#1A1A2E" }}>Demo credentials</strong>
            <span className="text-stone-400">Email: </span>
            <code className="text-red-700">{DEMO[role].email}</code><br />
            <span className="text-stone-400">Password: </span>
            <code className="text-red-700">{DEMO[role].password}</code>
          </div>
        </div>
      </main>
    </div>
  );
}
