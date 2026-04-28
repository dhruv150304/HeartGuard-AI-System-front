const predictions = [
  { date: "26 Apr", risk: "Low", score: 18, bp: "118/76", cholesterol: 168 },
  { date: "12 Apr", risk: "Low", score: 24, bp: "122/78", cholesterol: 174 },
  { date: "29 Mar", risk: "Medium", score: 39, bp: "130/84", cholesterol: 196 },
  { date: "15 Mar", risk: "High", score: 67, bp: "146/92", cholesterol: 224 },
];

const vitals = [
  ["Heart Rate", "72", "bpm"],
  ["Blood Pressure", "118/76", "mmHg"],
  ["Cholesterol", "168", "mg/dL"],
  ["Blood Sugar", "92", "mg/dL"],
];

const trend = [67, 52, 39, 32, 24, 18];

function RiskBadge({ risk }) {
  const cls = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls[risk]}`}>
      {risk}
    </span>
  );
}

function LineChart() {
  const points = trend
    .map((value, i) => {
      const x = 20 + i * 70;
      const y = 140 - value * 1.5;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 390 160" className="h-48 w-full">
      <polyline
        points={points}
        fill="none"
        stroke="#A32317"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {trend.map((value, i) => (
        <circle
          key={i}
          cx={20 + i * 70}
          cy={140 - value * 1.5}
          r="5"
          fill="#FDF8F3"
          stroke="#A32317"
          strokeWidth="3"
        />
      ))}
    </svg>
  );
}

export default function Dashboard({ onNewPrediction }) {
  const currentRisk = "Low";
  const riskScore = 18;

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#1A1A2E]">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h1 className="font-playfair text-2xl font-bold sm:text-3xl">
            Cardio<span className="text-red-500">Sense</span>
          </h1>

          <button type="button" onClick={onNewPrediction} className="w-full rounded-xl bg-red-900 px-5 py-3 text-sm font-semibold text-white sm:w-auto sm:py-2">
            New Prediction
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="mb-8">
          <h2 className="font-playfair text-3xl font-bold sm:text-4xl">
            Patient Dashboard
          </h2>
          <p className="mt-2 text-stone-500">
            Prediction history, health summary, risk level, and heart health
            trends.
          </p>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {vitals.map(([label, value, unit]) => (
            <div
              key={label}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {label}
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-playfair text-3xl font-bold">
                  {value}
                </span>
                <span className="pb-1 text-xs text-stone-400">{unit}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="mb-8 grid gap-5 xl:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-800">
                  Graph
                </p>
                <h3 className="font-playfair text-2xl font-bold">
                  Risk Score Trend
                </h3>
              </div>
              <RiskBadge risk={currentRisk} />
            </div>

            <LineChart />
          </div>

          <div className="rounded-xl bg-[#1A1A2E] p-6 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-red-200">
              Current Risk Level
            </p>

            <div className="mt-5 flex items-end gap-3">
              <span className="font-playfair text-5xl font-bold sm:text-7xl">
                {riskScore}
              </span>
              <span className="pb-3 text-sm text-white/60">/ 100</span>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-green-400"
                style={{ width: `${riskScore}%` }}
              />
            </div>

            <div className="mt-4 flex justify-between text-xs text-white/50">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>

            <p className="mt-6 text-sm leading-6 text-white/60">
              Your latest prediction shows a low cardiovascular risk. Keep
              monitoring your vitals regularly.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-800">
                Prediction History
              </p>
              <h3 className="font-playfair text-2xl font-bold">
                Previous Reports
              </h3>
            </div>
          </div>


          <div className="grid gap-3 md:hidden">
            {predictions.map((item) => (
              <div key={item.date} className="rounded-xl border border-stone-200 bg-[#fffaf6] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">{item.date}</p>
                    <p className="mt-1 font-playfair text-2xl font-bold">Score {item.score}</p>
                  </div>
                  <RiskBadge risk={item.risk} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-white p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">BP</p>
                    <p className="mt-1 font-semibold">{item.bp}</p>
                  </div>
                  <div className="rounded-lg bg-white p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Cholesterol</p>
                    <p className="mt-1 font-semibold">{item.cholesterol} mg/dL</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-stone-100 text-xs uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Risk Level</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Blood Pressure</th>
                  <th className="px-4 py-3">Cholesterol</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-200">
                {predictions.map((item) => (
                  <tr key={item.date}>
                    <td className="px-4 py-4 font-semibold">{item.date}</td>
                    <td className="px-4 py-4">
                      <RiskBadge risk={item.risk} />
                    </td>
                    <td className="px-4 py-4">{item.score}</td>
                    <td className="px-4 py-4">{item.bp}</td>
                    <td className="px-4 py-4">{item.cholesterol} mg/dL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
