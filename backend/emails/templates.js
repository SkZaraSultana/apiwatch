const getVerifyEmailTemplate = (url) => ({
  subject: "Verify your email",
  html: `
    <h2>Welcome to APIWatch</h2>
    <p>Please verify your email address by clicking the link below:</p>
    <a href="${url}" target="_blank" rel="noreferrer">Verify Email</a>
  `,
});

const getResetPasswordTemplate = (url) => ({
  subject: "Reset your password",
  html: `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <a href="${url}" target="_blank" rel="noreferrer">Reset Password</a>
    <p>If you did not request this, you can ignore this email.</p>
  `,
});

module.exports = {
  getVerifyEmailTemplate,
  getResetPasswordTemplate,
};
