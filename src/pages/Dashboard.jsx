import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

const colors = { Low: "bg-green-100 text-green-800", Medium: "bg-yellow-100 text-yellow-800", High: "bg-red-100 text-red-800" };

function RiskBadge({ risk }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[risk] || "bg-stone-100 text-stone-600"}`}>{risk || "No result"}</span>;
}

export default function Dashboard({ accessToken, onNewPrediction, onLogout }) {
  const [data, setData] = useState({ predictions: [], currentRisk: null, riskScore: null });
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/dashboard", accessToken).then(setData).catch((requestError) => setError(requestError.message));
  }, [accessToken]);

  const latest = data.predictions[0];
  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#1A1A2E]">
      <header className="border-b border-stone-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h1 className="font-playfair text-3xl font-bold">Cardio<span className="text-red-500">Sense</span></h1><p className="mt-1 text-sm text-stone-500">Your securely stored screening history</p></div><div className="flex gap-3"><button type="button" onClick={onNewPrediction} className="rounded-xl bg-red-900 px-5 py-3 text-sm font-semibold text-white">New Prediction</button><button type="button" onClick={onLogout} className="rounded-xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-600">Log out</button></div></div></header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {error && <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        <section className="grid gap-5 lg:grid-cols-[1fr_320px]"><div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-red-800">Latest screening</p><h2 className="mt-3 font-playfair text-3xl font-bold">{latest ? `${latest.probability}% risk score` : "No screenings yet"}</h2><p className="mt-3 text-sm leading-6 text-stone-500">{latest ? `Saved ${new Date(latest.created_at).toLocaleDateString()}. This result is screening support only and is not a medical diagnosis.` : "Complete a screening to create your first encrypted health record."}</p></div><div className="rounded-2xl bg-[#1A1A2E] p-6 text-white"><p className="text-xs font-bold uppercase tracking-widest text-white/50">Current risk level</p><div className="mt-5"><RiskBadge risk={data.currentRisk} /></div><p className="mt-8 text-5xl font-bold">{data.riskScore ?? "—"}<span className="text-base font-normal text-white/50"> / 100</span></p></div></section>
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"><div className="mb-5"><p className="text-xs font-bold uppercase tracking-widest text-red-800">Prediction history</p><h2 className="mt-2 font-playfair text-2xl font-bold">Saved assessments</h2></div>{data.predictions.length === 0 ? <p className="rounded-xl bg-stone-50 p-5 text-sm text-stone-500">No saved assessments yet.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="border-b text-xs uppercase tracking-wider text-stone-500"><tr><th className="pb-3">Date</th><th className="pb-3">Risk</th><th className="pb-3">Score</th><th className="pb-3">Confidence</th><th className="pb-3">Blood pressure</th><th className="pb-3">Cholesterol</th></tr></thead><tbody>{data.predictions.map((prediction) => <tr key={prediction.id} className="border-b border-stone-100"><td className="py-4">{new Date(prediction.created_at).toLocaleDateString()}</td><td className="py-4"><RiskBadge risk={prediction.risk} /></td><td className="py-4 font-bold">{prediction.probability}/100</td><td className="py-4">{prediction.confidence}%</td><td className="py-4">{prediction.input?.RestingBP ?? "—"} mm Hg</td><td className="py-4">{prediction.input?.Cholesterol ?? "—"} mg/dL</td></tr>)}</tbody></table></div>}</section>
      </main>
    </div>
  );
}
