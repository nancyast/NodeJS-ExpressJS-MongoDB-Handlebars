const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: '25',
    auth: {
      user: 'b789fa0bd9eebb',
      pass: '16a34c6eb5d75e',
    },
  });

  // 2. Create an email options
  const mailOptions = {
    from: 'Nhung Nguyen <nhungast1@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

const message = `Forgot your password? Submit a PATCH request
   with your new password and passwordConfirmed to ${'1234'}.\n`;

sendEmail({
  email: 'nhungast@gmail.com',
  subject: 'Your password reset token, valid for 5 min',
  message,
});

module.exports = sendEmail;
