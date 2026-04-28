export default function Reports() {
  const reports = [
    {
      id: 1,
      date: "26 Apr 2026",
      title: "Monthly Health Summary",
      status: "Complete",
      downloadUrl: "#",
    },
    {
      id: 2,
      date: "12 Apr 2026",
      title: "Risk Assessment Report",
      status: "Complete",
      downloadUrl: "#",
    },
    {
      id: 3,
      date: "29 Mar 2026",
      title: "Quarterly Health Report",
      status: "Complete",
      downloadUrl: "#",
    },
    {
      id: 4,
      date: "15 Mar 2026",
      title: "Annual Health Overview",
      status: "Pending",
      downloadUrl: "#",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Reports</h1>

      <div className="grid gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {report.title}
                </h2>
                <p className="text-gray-500 text-sm">{report.date}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  report.status === "Complete"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {report.status}
              </span>
            </div>
            <button className="w-full bg-red-900 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              📥 Download Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
