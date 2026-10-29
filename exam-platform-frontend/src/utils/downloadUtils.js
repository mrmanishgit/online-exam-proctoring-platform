export function downloadTextFile(filename, content, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content ?? ""], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename || "download.txt";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function downloadCSV(filename, rows = []) {
  const escapeCell = (value) => {
    const text = value == null ? "" : String(value);
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\r\n");
  downloadTextFile(filename, `\uFEFF${csv}`, "text/csv;charset=utf-8");
}

export function downloadJSON(filename, value) {
  downloadTextFile(filename, JSON.stringify(value, null, 2), "application/json;charset=utf-8");
}
