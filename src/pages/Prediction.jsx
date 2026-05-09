import { useState } from "react";
import { downloadJsonReport, printReportPdf, reportFilename } from "../utils/exportReport";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

const initialForm = {
  Age: 40,
  Sex: "M",
  ChestPainType: "ATA",
  RestingBP: 120,
  Cholesterol: 200,
  FastingBS: 0,
  RestingECG: "Normal",
  MaxHR: 150,
  ExerciseAngina: "N",
  Oldpeak: 1,
  ST_Slope: "Up",
};

const fieldGroups = [
  {
    title: "Patient profile",
    fields: [
      { name: "Age", label: "Age", type: "number", min: 18, max: 100, suffix: "years" },
      { name: "Sex", label: "Sex", type: "select", options: [["M", "Male"], ["F", "Female"]] },
      { name: "ChestPainType", label: "Chest pain type", type: "select", options: [["ASY", "Asymptomatic"], ["ATA", "Atypical angina"], ["NAP", "Non-anginal pain"], ["TA", "Typical angina"]] },
    ],
  },
  {
    title: "Clinical measurements",
    fields: [
      { name: "RestingBP", label: "Resting blood pressure", type: "number", min: 80, max: 220, suffix: "mm Hg" },
      { name: "Cholesterol", label: "Cholesterol", type: "number", min: 80, max: 650, suffix: "mg/dL" },
      { name: "FastingBS", label: "Fasting blood sugar > 120", type: "select", options: [[0, "No"], [1, "Yes"]] },
      { name: "RestingECG", label: "Resting ECG", type: "select", options: [["Normal", "Normal"], ["ST", "ST abnormality"], ["LVH", "LVH"]] },
    ],
  },
  {
    title: "Exercise test",
    fields: [
      { name: "MaxHR", label: "Maximum heart rate", type: "number", min: 60, max: 220, suffix: "bpm" },
      { name: "ExerciseAngina", label: "Exercise-induced angina", type: "select", options: [["N", "No"], ["Y", "Yes"]] },
      { name: "Oldpeak", label: "Oldpeak ST depression", type: "number", min: 0, max: 6, step: 0.1, suffix: "mm" },
      { name: "ST_Slope", label: "ST slope", type: "select", options: [["Up", "Up"], ["Flat", "Flat"], ["Down", "Down"]] },
    ],
  },
];


function estimateRisk(form) {
  let score = 8;
  score += Math.max(0, Number(form.Age) - 45) * 0.8;
  score += form.Sex === "M" ? 6 : 2;
  score += form.ChestPainType === "ASY" ? 22 : form.ChestPainType === "TA" ? 12 : form.ChestPainType === "NAP" ? 7 : 3;
  score += Math.max(0, Number(form.RestingBP) - 120) * 0.35;
  score += Math.max(0, Number(form.Cholesterol) - 190) * 0.12;
  score += Number(form.FastingBS) === 1 ? 8 : 0;
  score += form.RestingECG === "ST" ? 8 : form.RestingECG === "LVH" ? 5 : 0;
  score += Math.max(0, 150 - Number(form.MaxHR)) * 0.28;
  score += form.ExerciseAngina === "Y" ? 16 : 0;
  score += Number(form.Oldpeak) * 6;
  score += form.ST_Slope === "Flat" ? 14 : form.ST_Slope === "Down" ? 22 : 0;

  const bounded = Math.max(3, Math.min(96, Math.round(score)));
  const prediction = bounded >= 50 ? 1 : 0;
  const risk = bounded >= 70 ? "High" : bounded >= 40 ? "Medium" : "Low";
  return { prediction, risk, probability: bounded };
}


function getResultTheme(result) {
  if (!result) return null;

  if (result.prediction === 1 || result.risk === "High") {
    return {
      status: "High risk",
      title: "Heart disease risk detected",
      tone: "red",
      panel: "from-red-950 to-red-800",
      ring: "border-red-200 bg-red-50 text-red-800",
      bar: "bg-red-500",
      iconBg: "bg-red-500",
      text: "The model found warning signs in the entered values. Please consult a cardiologist for a clinical review.",
      suggestions: [
        "Book a doctor consultation and share this report.",
        "Monitor blood pressure, cholesterol, and blood sugar regularly.",
        "Avoid intense exercise until a clinician reviews symptoms.",
        "Follow a heart-healthy diet with lower saturated fat and salt.",
      ],
    };
  }

  if (result.risk === "Medium") {
    return {
      status: "Medium risk",
      title: "Moderate risk indicators found",
      tone: "amber",
      panel: "from-amber-900 to-orange-700",
      ring: "border-amber-200 bg-amber-50 text-amber-800",
      bar: "bg-amber-400",
      iconBg: "bg-amber-400",
      text: "Some values need attention. Improving lifestyle factors and repeating screening can help reduce future risk.",
      suggestions: [
        "Schedule a routine check-up if symptoms continue.",
        "Increase weekly walking or light cardio if medically safe.",
        "Track blood pressure and cholesterol trends.",
        "Reduce smoking, alcohol, high-salt foods, and stress triggers.",
      ],
    };
  }

  return {
    status: "Safe range",
    title: "No heart disease risk detected",
    tone: "green",
    panel: "from-emerald-950 to-emerald-700",
    ring: "border-emerald-200 bg-emerald-50 text-emerald-800",
    bar: "bg-emerald-400",
    iconBg: "bg-emerald-400",
    text: "The entered values are currently in a safer range according to the model. Keep monitoring regularly.",
    suggestions: [
      "Maintain regular exercise and balanced meals.",
      "Repeat screening if symptoms appear or values change.",
      "Keep cholesterol, blood pressure, and sugar within healthy ranges.",
      "Continue preventive check-ups as recommended by your doctor.",
    ],
  };
}

function ResultReport({ result, onEdit, onReset, onDownloadPdf, onExportResult }) {
  if (!result) {
    return (
      <section className="rounded-[8px] border border-[#eadfd8] bg-[#1A1A2E] p-6 text-white shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-red-200">Prediction result</p>
        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/62">
          Fill the form and click predict. If your Python API is running on port 8001, this page will use the real model. Otherwise it shows a frontend estimate.
        </div>
      </section>
    );
  }

  const theme = getResultTheme(result);
  const confidence = result.confidence ?? result.probability;

  return (
    <section className="overflow-hidden rounded-[8px] border border-[#eadfd8] bg-white shadow-sm">
      <div className={"bg-gradient-to-br " + theme.panel + " p-6 text-white"}>
        <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Result page</p>
          <span className={"rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider " + theme.ring}>{theme.status}</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className={"flex h-14 w-14 shrink-0 items-center justify-center rounded-full " + theme.iconBg}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {theme.tone === "green" ? <path d="M20 6 9 17l-5-5" /> : <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></>}
            </svg>
          </div>
          <div>
            <h2 className="font-playfair text-2xl font-bold leading-tight sm:text-3xl">{theme.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">{theme.text}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-white/55">Prediction</p>
            <p className="mt-2 text-2xl font-bold">{result.prediction === 1 ? "Positive" : "Negative"}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-white/55">Confidence</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-playfair text-3xl font-bold sm:text-4xl">{confidence}%</span>
              <span className="pb-1 text-xs text-white/55">model score</span>
            </div>
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/15">
          <div className={"h-full rounded-full " + theme.bar} style={{ width: confidence + "%" }} />
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-playfair text-2xl font-bold">Suggestions</h3>
        <div className="mt-4 grid gap-3">
          {theme.suggestions.map((suggestion) => (
            <div key={suggestion} className="flex gap-3 rounded-xl bg-[#F5F0EA] p-4 text-sm font-semibold text-stone-700">
              <span className={"mt-1 h-2.5 w-2.5 shrink-0 rounded-full " + theme.bar} />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onDownloadPdf} className="w-full rounded-xl bg-[#982016] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg">Download PDF</button>
          <button type="button" onClick={onExportResult} className="w-full rounded-xl border border-[#eadfd8] px-5 py-3 text-sm font-bold text-stone-600 transition hover:border-red-200 hover:text-red-800">Export result</button>
          <button type="button" onClick={onEdit} className="w-full rounded-xl border border-[#eadfd8] px-5 py-3 text-sm font-bold text-stone-600 transition hover:border-red-200 hover:text-red-800">Edit inputs</button>
          <button type="button" onClick={onReset} className="w-full rounded-xl border border-[#eadfd8] px-5 py-3 text-sm font-bold text-stone-600 transition hover:border-red-200 hover:text-red-800">New prediction</button>
        </div>

        <p className="mt-5 text-xs leading-5 text-stone-400">Source: {result.source}. This is a screening output, not a medical diagnosis.</p>
      </div>
    </section>
  );
}

function Field({ field, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-500">{field.label}</span>
      <div className="relative">
        {field.type === "select" ? (
          <select
            value={value}
            onChange={(event) => onChange(field.name, field.name === "FastingBS" ? Number(event.target.value) : event.target.value)}
            className="min-h-12 w-full rounded-xl border border-[#eadfd8] bg-white px-4 py-3 text-sm font-semibold text-[#1A1A2E] outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
          >
            {field.options.map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}
          </select>
        ) : (
          <input
            type="number"
            min={field.min}
            max={field.max}
            step={field.step || 1}
            value={value}
            onChange={(event) => onChange(field.name, event.target.value)}
            className="min-h-12 w-full rounded-xl border border-[#eadfd8] bg-white px-4 py-3 pr-20 text-sm font-semibold text-[#1A1A2E] outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
          />
        )}
        {field.suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">{field.suffix}</span>}
      </div>
    </label>
  );
}

export default function Prediction({ onBack }) {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handlePredict(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Prediction API unavailable");
      const data = await response.json();
      const probability = Math.round(Number(data.probability ?? data.riskScore ?? (data.prediction ? 76 : 22)));
      const confidence = Math.max(probability, 100 - probability);
      setResult({
        prediction: Number(data.prediction),
        risk: data.risk || (probability >= 70 ? "High" : probability >= 40 ? "Medium" : "Low"),
        probability,
        confidence,
        source: "Python model API",
      });
    } catch {
      const estimated = estimateRisk(form);
      setResult({ ...estimated, confidence: Math.max(estimated.probability, 100 - estimated.probability), source: "Frontend estimate - connect FastAPI backend for exact model" });
    } finally {
      setLoading(false);
    }
  }

  function buildPredictionReport() {
    if (!result) return null;

    const theme = getResultTheme(result);
    return {
      title: "Heart Disease Prediction Report",
      subtitle: "Screening result generated from the CardioSense prediction form.",
      status: theme.status,
      metrics: [
        { label: "Prediction", value: result.prediction === 1 ? "Positive" : "Negative" },
        { label: "Confidence", value: (result.confidence ?? result.probability) + "%" },
        { label: "Risk level", value: result.risk },
        { label: "Risk score", value: result.probability + "/100" },
        { label: "Age", value: form.Age },
        { label: "Blood pressure", value: form.RestingBP + " mm Hg" },
        { label: "Cholesterol", value: form.Cholesterol + " mg/dL" },
        { label: "Max heart rate", value: form.MaxHR + " bpm" },
      ],
      suggestions: theme.suggestions,
      notes: theme.text,
      form,
      result,
      generatedAt: new Date().toISOString(),
    };
  }

  function handleDownloadPdf() {
    const report = buildPredictionReport();
    if (!report) return;
    printReportPdf(report);
  }

  function handleExportResult() {
    const report = buildPredictionReport();
    if (!report) return;
    downloadJsonReport(reportFilename("prediction-result", report.status), report);
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#1A1A2E]">
      <header className="border-b border-[#eadfd8] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="font-playfair text-2xl font-bold sm:text-3xl">Heart Disease Prediction</h1>
            <p className="mt-1 text-sm text-stone-500">Enter patient values using the same fields from your trained KNN model.</p>
          </div>
          <button type="button" onClick={onBack} className="w-full rounded-xl border border-[#eadfd8] px-4 py-3 text-sm font-bold text-stone-600 transition hover:border-red-200 hover:text-red-800 sm:w-auto sm:py-2">Dashboard</button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 xl:grid-cols-[1.1fr_.9fr]">
        <form onSubmit={handlePredict} className="space-y-5">
          {fieldGroups.map((group) => (
            <section key={group.title} className="rounded-[8px] border border-[#eadfd8] bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-5 font-playfair text-2xl font-bold">{group.title}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.fields.map((field) => <Field key={field.name} field={field} value={form[field.name]} onChange={updateField} />)}
              </div>
            </section>
          ))}

          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#982016] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 sm:w-auto">
              {loading ? "Predicting..." : "Predict heart disease risk"}
            </button>
            <button type="button" onClick={() => { setForm(initialForm); setResult(null); }} className="w-full rounded-xl border border-[#eadfd8] bg-white px-6 py-3 text-sm font-bold text-stone-600 transition hover:border-red-200 hover:text-red-800 sm:w-auto">Reset</button>
          </div>
        </form>

        <aside className="space-y-5">
          <ResultReport
            result={result}
            onEdit={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            onReset={() => { setForm(initialForm); setResult(null); }}
            onDownloadPdf={handleDownloadPdf}
            onExportResult={handleExportResult}
          />
        </aside>
      </main>
    </div>
  );
}
