import { useMemo, useState } from "react";
import { downloadJsonReport, printReportPdf, reportFilename } from "../utils/exportReport";

const patients = [
  {
    id: "PT-1024",
    name: "Aarav Mehta",
    age: 54,
    sex: "Male",
    risk: "High",
    score: 78,
    lastReport: "26 Apr 2026",
    phone: "+91 98765 12034",
    bp: "148/94",
    cholesterol: 238,
    heartRate: 86,
    diagnosis: "Heart disease risk detected",
    notes: "Exercise angina reported. ST slope flat with elevated cholesterol.",
    suggestions: ["Schedule ECG review", "Adjust cholesterol management", "Follow up within 7 days"],
  },
  {
    id: "PT-1025",
    name: "Isha Kapoor",
    age: 46,
    sex: "Female",
    risk: "Low",
    score: 18,
    lastReport: "25 Apr 2026",
    phone: "+91 98111 34490",
    bp: "118/76",
    cholesterol: 168,
    heartRate: 72,
    diagnosis: "No heart disease risk detected",
    notes: "Vitals are stable. Continue preventive monitoring.",
    suggestions: ["Routine check-up", "Maintain activity", "Repeat screening in 6 months"],
  },
  {
    id: "PT-1026",
    name: "Kabir Singh",
    age: 61,
    sex: "Male",
    risk: "Medium",
    score: 52,
    lastReport: "23 Apr 2026",
    phone: "+91 99002 45678",
    bp: "136/86",
    cholesterol: 211,
    heartRate: 80,
    diagnosis: "Moderate risk indicators found",
    notes: "Resting BP and cholesterol are above ideal range.",
    suggestions: ["Lifestyle counselling", "Repeat lipid profile", "Review in 30 days"],
  },
  {
    id: "PT-1027",
    name: "Meera Rao",
    age: 39,
    sex: "Female",
    risk: "Low",
    score: 24,
    lastReport: "21 Apr 2026",
    phone: "+91 98888 76123",
    bp: "122/78",
    cholesterol: 174,
    heartRate: 76,
    diagnosis: "No heart disease risk detected",
    notes: "Slightly elevated stress markers but overall safe range.",
    suggestions: ["Continue monitoring", "Improve sleep routine", "Repeat screening if symptoms appear"],
  },
  {
    id: "PT-1028",
    name: "Rohan Malhotra",
    age: 58,
    sex: "Male",
    risk: "High",
    score: 84,
    lastReport: "20 Apr 2026",
    phone: "+91 97654 22310",
    bp: "152/96",
    cholesterol: 252,
    heartRate: 91,
    diagnosis: "Heart disease risk detected",
    notes: "High model score with asymptomatic chest pain type and exercise angina.",
    suggestions: ["Urgent cardiology appointment", "Monitor BP daily", "Avoid strenuous activity"],
  },
];

function RiskBadge({ risk }) {
  const styles = {
    Low: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Medium: "bg-amber-100 text-amber-800 border-amber-200",
    High: "bg-red-100 text-red-800 border-red-200",
  };

  return <span className={"rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider " + styles[risk]}>{risk}</span>;
}

function StatCard({ label, value, tone }) {
  const tones = {
    red: "bg-red-50 text-red-900",
    amber: "bg-amber-50 text-amber-900",
    green: "bg-emerald-50 text-emerald-900",
    dark: "bg-[#1A1A2E] text-white",
  };

  return (
    <div className={"rounded-[8px] p-5 shadow-sm " + tones[tone]}>
      <p className="text-xs font-bold uppercase tracking-wider opacity-60">{label}</p>
      <p className="mt-3 font-playfair text-3xl font-bold">{value}</p>
    </div>
  );
}

export default function DoctorDashboard({ onLogout }) {
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(patients[0].id);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch = [patient.name, patient.id, patient.phone].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesRisk = riskFilter === "All" || patient.risk === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [query, riskFilter]);

  const selectedPatient = patients.find((patient) => patient.id === selectedId) || filteredPatients[0] || patients[0];
  const highRiskCount = patients.filter((patient) => patient.risk === "High").length;
  const mediumRiskCount = patients.filter((patient) => patient.risk === "Medium").length;
  const lowRiskCount = patients.filter((patient) => patient.risk === "Low").length;

  function buildPatientReport() {
    return {
      title: selectedPatient.name + " - Patient Report",
      subtitle: selectedPatient.id + " · " + selectedPatient.age + " yrs · " + selectedPatient.sex + " · Last report: " + selectedPatient.lastReport,
      status: selectedPatient.risk + " risk",
      metrics: [
        { label: "Prediction", value: selectedPatient.diagnosis },
        { label: "Risk score", value: selectedPatient.score + "/100" },
        { label: "Blood pressure", value: selectedPatient.bp },
        { label: "Heart rate", value: selectedPatient.heartRate + " bpm" },
        { label: "Cholesterol", value: selectedPatient.cholesterol + " mg/dL" },
        { label: "Phone", value: selectedPatient.phone },
      ],
      suggestions: selectedPatient.suggestions,
      notes: selectedPatient.notes,
      patient: selectedPatient,
      generatedAt: new Date().toISOString(),
    };
  }

  function handleDownloadReportPdf() {
    printReportPdf(buildPatientReport());
  }

  function handleExportReport() {
    const report = buildPatientReport();
    downloadJsonReport(reportFilename("patient-report", selectedPatient.id), report);
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#1A1A2E]">
      <header className="border-b border-[#eadfd8] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="font-playfair text-2xl font-bold sm:text-3xl">Doctor Dashboard</h1>
            <p className="mt-1 text-sm text-stone-500">View patients, filter by risk, and review prediction reports.</p>
          </div>
          <button type="button" onClick={onLogout} className="w-full rounded-xl border border-[#eadfd8] px-4 py-3 text-sm font-bold text-stone-600 transition hover:border-red-200 hover:text-red-800 sm:w-auto sm:py-2">Log out</button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total patients" value={patients.length} tone="dark" />
          <StatCard label="High risk" value={highRiskCount} tone="red" />
          <StatCard label="Medium risk" value={mediumRiskCount} tone="amber" />
          <StatCard label="Low risk" value={lowRiskCount} tone="green" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[8px] border border-[#eadfd8] bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-800">All patients</p>
                <h2 className="font-playfair text-2xl font-bold">Patient list</h2>
              </div>
              <span className="rounded-full bg-[#F5F0EA] px-3 py-1 text-xs font-bold text-stone-500">{filteredPatients.length} shown</span>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_180px]">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, ID, or phone"
                className="rounded-xl border border-[#eadfd8] bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100"
              />
              <select
                value={riskFilter}
                onChange={(event) => setRiskFilter(event.target.value)}
                className="rounded-xl border border-[#eadfd8] bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100"
              >
                {['All', 'High', 'Medium', 'Low'].map((risk) => <option key={risk} value={risk}>{risk} risk</option>)}
              </select>
            </div>


            <div className="grid gap-3 md:hidden">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className={"rounded-xl border p-4 " + (selectedPatient.id === patient.id ? "border-red-200 bg-red-50/70" : "border-[#eadfd8] bg-[#fffaf6]")}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{patient.name}</p>
                      <p className="mt-1 text-xs text-stone-400">{patient.id} · {patient.age} yrs · {patient.sex}</p>
                    </div>
                    <RiskBadge risk={patient.risk} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Score</p>
                      <p className="mt-1 font-playfair text-2xl font-bold">{patient.score}</p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Last report</p>
                      <p className="mt-2 text-xs font-semibold text-stone-600">{patient.lastReport}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setSelectedId(patient.id)} className="mt-4 w-full rounded-lg bg-[#982016] px-3 py-3 text-xs font-bold text-white transition hover:bg-red-800">View report</button>
                </div>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-[8px] border border-[#eadfd8] md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[#F5F0EA] text-xs uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Risk</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Last report</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eadfd8]">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className={selectedPatient.id === patient.id ? "bg-red-50/60" : "bg-white"}>
                      <td className="px-4 py-4">
                        <p className="font-bold">{patient.name}</p>
                        <p className="text-xs text-stone-400">{patient.id} · {patient.age} yrs · {patient.sex}</p>
                      </td>
                      <td className="px-4 py-4"><RiskBadge risk={patient.risk} /></td>
                      <td className="px-4 py-4 font-bold">{patient.score}</td>
                      <td className="px-4 py-4 text-stone-500">{patient.lastReport}</td>
                      <td className="px-4 py-4">
                        <button type="button" onClick={() => setSelectedId(patient.id)} className="rounded-lg bg-[#982016] px-3 py-2 text-xs font-bold text-white transition hover:bg-red-800">View report</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-[8px] border border-[#eadfd8] bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-800">Patient report</p>
                <h2 className="font-playfair text-2xl font-bold sm:text-3xl">{selectedPatient.name}</h2>
                <p className="mt-1 text-sm text-stone-500">{selectedPatient.id} · {selectedPatient.phone}</p>
              </div>
              <RiskBadge risk={selectedPatient.risk} />
            </div>

            <div className="rounded-[8px] bg-[#1A1A2E] p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Prediction score</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-playfair text-5xl font-bold sm:text-6xl">{selectedPatient.score}</span>
                <span className="pb-2 text-sm text-white/50">/ 100</span>
              </div>
              <p className="mt-4 text-sm text-white/70">{selectedPatient.diagnosis}</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#F5F0EA] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">BP</p>
                <p className="mt-2 font-playfair text-2xl font-bold">{selectedPatient.bp}</p>
              </div>
              <div className="rounded-xl bg-[#F5F0EA] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Heart rate</p>
                <p className="mt-2 font-playfair text-2xl font-bold">{selectedPatient.heartRate}</p>
              </div>
              <div className="rounded-xl bg-[#F5F0EA] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Cholesterol</p>
                <p className="mt-2 font-playfair text-2xl font-bold">{selectedPatient.cholesterol}</p>
              </div>
              <div className="rounded-xl bg-[#F5F0EA] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Age</p>
                <p className="mt-2 font-playfair text-2xl font-bold">{selectedPatient.age}</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#eadfd8] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Clinical notes</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">{selectedPatient.notes}</p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Suggested actions</p>
              <div className="mt-3 space-y-2">
                {selectedPatient.suggestions.map((suggestion) => (
                  <div key={suggestion} className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-900">{suggestion}</div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={handleDownloadReportPdf} className="w-full rounded-xl bg-[#982016] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg">Download PDF</button>
              <button type="button" onClick={handleExportReport} className="w-full rounded-xl border border-[#eadfd8] px-5 py-3 text-sm font-bold text-stone-600 transition hover:border-red-200 hover:text-red-800">Export report</button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
