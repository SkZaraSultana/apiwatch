const PDFDocument = require("pdfkit");

const escapeCsv = (value) => {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const buildCsv = (report) => {
  const lines = [];

  lines.push("APIWatch Report");
  lines.push(`Period,${escapeCsv(report.periodLabel)}`);
  lines.push(`Generated At,${escapeCsv(report.generatedAt)}`);
  lines.push(
    `Date Range,${escapeCsv(report.dateRange.from)} to ${escapeCsv(report.dateRange.to)}`
  );
  lines.push("");

  lines.push("Summary");
  lines.push("Metric,Value");
  Object.entries(report.summary).forEach(([key, value]) => {
    lines.push(`${escapeCsv(key)},${escapeCsv(value)}`);
  });
  lines.push("");

  lines.push("Monitors");
  lines.push("Name,URL,Status,Uptime %,Avg Response (ms),Checks");
  report.monitors.forEach((monitor) => {
    lines.push(
      [
        escapeCsv(monitor.name),
        escapeCsv(monitor.url),
        escapeCsv(monitor.status),
        escapeCsv(monitor.uptimePercent),
        escapeCsv(monitor.avgResponseTimeMs),
        escapeCsv(monitor.checkCount),
      ].join(",")
    );
  });
  lines.push("");

  lines.push("Alerts");
  lines.push("Type,Title,Monitor,Created At");
  report.alerts.forEach((alert) => {
    lines.push(
      [
        escapeCsv(alert.type),
        escapeCsv(alert.title),
        escapeCsv(alert.monitorName),
        escapeCsv(alert.createdAt),
      ].join(",")
    );
  });
  lines.push("");

  lines.push("Incidents");
  lines.push("Title,Monitor,Status,Started At,Resolved At");
  report.incidents.forEach((incident) => {
    lines.push(
      [
        escapeCsv(incident.title),
        escapeCsv(incident.monitorName),
        escapeCsv(incident.status),
        escapeCsv(incident.startedAt),
        escapeCsv(incident.resolvedAt || "—"),
      ].join(",")
    );
  });
  lines.push("");

  lines.push("Security Events");
  lines.push("Type,Severity,Title,Monitor,Detected At");
  report.securityEvents.forEach((event) => {
    lines.push(
      [
        escapeCsv(event.typeLabel),
        escapeCsv(event.severity),
        escapeCsv(event.title),
        escapeCsv(event.monitorName),
        escapeCsv(event.detectedAt),
      ].join(",")
    );
  });

  return `${lines.join("\n")}\n`;
};

const buildPdfBuffer = (report) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc
      .fillColor("#1e3a8a")
      .fontSize(22)
      .text("APIWatch Report", { align: "left" });
    doc.moveDown(0.3);
    doc.fillColor("#334155").fontSize(12).text(report.periodLabel);
    doc.text(`Generated: ${new Date(report.generatedAt).toUTCString()}`);
    doc.text(
      `Range: ${new Date(report.dateRange.from).toUTCString()} — ${new Date(report.dateRange.to).toUTCString()}`
    );

    doc.moveDown();
    doc.fillColor("#0f172a").fontSize(14).text("Executive Summary");
    doc.moveDown(0.4);
    doc.fontSize(11).fillColor("#334155");

    Object.entries(report.summary).forEach(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (char) => char.toUpperCase());
      doc.text(`${label}: ${value}`);
    });

    const writeSection = (title, rows, columns) => {
      doc.moveDown();
      doc.fillColor("#0f172a").fontSize(13).text(title);
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#475569");

      if (rows.length === 0) {
        doc.text("No records in this period.");
        return;
      }

      rows.slice(0, 12).forEach((row) => {
        const line = columns.map((col) => row[col] ?? "—").join(" | ");
        doc.text(line, { width: 500 });
      });

      if (rows.length > 12) {
        doc.text(`...and ${rows.length - 12} more`);
      }
    };

    writeSection("Monitors", report.monitors, [
      "name",
      "status",
      "uptimePercent",
      "avgResponseTimeMs",
    ]);
    writeSection("Alerts", report.alerts, ["type", "title", "monitorName"]);
    writeSection("Incidents", report.incidents, [
      "title",
      "status",
      "monitorName",
    ]);
    writeSection("Security Events", report.securityEvents, [
      "typeLabel",
      "severity",
      "title",
    ]);

    doc.end();
  });

module.exports = {
  buildCsv,
  buildPdfBuffer,
};
