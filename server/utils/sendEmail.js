const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // This is for development only, to bypass self-signed certificate errors
    tls: {
      rejectUnauthorized: false,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: 'MyMedicalApp <noreply@medical.app>', // This can be any address for sandbox
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;