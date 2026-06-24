const baseLayout = ({ title, preheader, bodyContent }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:Arial,Helvetica,sans-serif;color:#e2e8f0;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f172a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#111827;border:1px solid #1f2937;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;background:linear-gradient(135deg,#1e3a8a,#2d6cdf);">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">APIWatch</p>
              <p style="margin:8px 0 0;font-size:13px;color:#dbeafe;">API reliability monitoring</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${bodyContent}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;border-top:1px solid #1f2937;background-color:#0b1220;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                You are receiving this because alerts are enabled for your APIWatch account.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const detailRow = (label, value) => `
  <tr>
    <td style="padding:8px 0;font-size:13px;color:#94a3b8;width:140px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;font-size:13px;color:#f8fafc;vertical-align:top;">${value}</td>
  </tr>
`;

const detailsTable = (rows) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;">
    ${rows.join("")}
  </table>
`;

const ctaButton = (url, label) => `
  <p style="margin:24px 0 0;">
    <a href="${url}" style="display:inline-block;background-color:#2d6cdf;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;">
      ${label}
    </a>
  </p>
`;

module.exports = {
  baseLayout,
  detailRow,
  detailsTable,
  ctaButton,
};
