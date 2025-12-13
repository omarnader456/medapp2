const nodemailer = require('nodemailer');

const mailer = async (options) => {
  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user, 
        pass: testAccount.pass, 
      },
      // FIX: Add this block to ignore certificate errors
      tls: {
        rejectUnauthorized: false
      }
    });

    const message = {
      from: '"Medical App Security" <no-reply@healthcure.com>',
      to: options.email,
      subject: options.subject,
      text: options.message, 
    };

    const info = await transporter.sendMail(message);

    console.log("\n==================================================");
    console.log("📧 EMAIL SENT (SANDBOX MODE)");
    console.log(`To: ${options.email}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    console.log("==================================================\n");

  } catch (err) {
    console.log("Email Error:", err);
  }
};

module.exports = mailer;