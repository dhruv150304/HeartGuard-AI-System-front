function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(value) {
  return String(value || "report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function downloadJsonReport(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".json") ? filename : filename + ".json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function printReportPdf({ title, subtitle, status, metrics = [], suggestions = [], notes }) {
  const printable = window.open("", "_blank", "width=900,height=700");
  if (!printable) return;

  const statusText = status || "Report";
  const isHigh = /high|detected|positive/i.test(statusText);
  const accent = isHigh ? "#B42318" : "#047857";
  const bg = isHigh ? "#FEF3F2" : "#ECFDF3";

  const metricHtml = metrics.map((item) =>
    '<div class="metric"><span>' + escapeHtml(item.label) + '</span><strong>' + escapeHtml(item.value) + '</strong></div>'
  ).join("");

  const suggestionHtml = suggestions.map((item) => '<li>' + escapeHtml(item) + '</li>').join("");
  const notesHtml = notes ? '<div class="notes">' + escapeHtml(notes) + '</div>' : "";
  const suggestionsHtml = suggestions.length ? '<h2>Suggestions</h2><ul>' + suggestionHtml + '</ul>' : "";

  printable.document.write(
    '<!doctype html><html><head><title>' + escapeHtml(title) + '</title>' +
    '<style>' +
    '*{box-sizing:border-box}' +
    'body{margin:0;padding:32px;font-family:Arial,sans-serif;color:#1A1A2E;background:#fff}' +
    '.brand{font-size:14px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#982016}' +
    'h1{margin:10px 0 6px;font-size:32px;line-height:1.1}' +
    '.subtitle{margin:0 0 24px;color:#6b625f;line-height:1.6}' +
    '.status{display:inline-block;margin-bottom:24px;padding:8px 14px;border-radius:999px;background:' + bg + ';color:' + accent + ';font-weight:800;text-transform:uppercase;font-size:12px;letter-spacing:.08em}' +
    '.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:20px 0}' +
    '.metric{border:1px solid #eadfd8;border-radius:10px;padding:14px;background:#fffaf6}' +
    '.metric span{display:block;color:#7A6E6E;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}' +
    '.metric strong{display:block;margin-top:8px;font-size:22px}' +
    '.notes{margin-top:20px;padding:16px;border-left:4px solid ' + accent + ';background:' + bg + ';line-height:1.6}' +
    'h2{margin-top:28px;font-size:20px}li{margin:8px 0;line-height:1.5}' +
    '.footer{margin-top:32px;color:#8b8580;font-size:12px}' +
    '@media print{body{padding:24px}button{display:none}}' +
    '</style></head><body>' +
    '<div class="brand">CardioSense</div>' +
    '<h1>' + escapeHtml(title) + '</h1>' +
    '<p class="subtitle">' + escapeHtml(subtitle) + '</p>' +
    '<div class="status">' + escapeHtml(statusText) + '</div>' +
    '<div class="grid">' + metricHtml + '</div>' +
    notesHtml + suggestionsHtml +
    '<p class="footer">Generated from CardioSense. This screening report is not a medical diagnosis.</p>' +
    '<script>window.onload=function(){window.print()};</script>' +
    '</body></html>'
  );

  printable.document.close();
}

export function reportFilename(prefix, subject) {
  const stamp = new Date().toISOString().slice(0, 10);
  return slugify(prefix + "-" + subject + "-" + stamp);
}
