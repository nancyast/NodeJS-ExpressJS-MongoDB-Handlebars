const nodemailer = require('nodemailer');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = 'Admin <nhungast@gmail.com>';
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      const client = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: 'pass',
        },
      });

      return client;
    }

    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: '25',
      auth: {
        user: 'b789fa0bd9eebb',
        pass: '16a34c6eb5d75e',
      },
    });
  }

  async send(template, subject) {
    // 1. Render HTML based on handlebars template
    const html = '<div> need to be rendered by handlebars </div>';

    // 2. Define email option
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: 'need to be convert from html to text',
    };

    // 3. Create a transport and send email
    await this.createTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to our family!');
  }
}

const emailSender = new Email(
  { email: 'nhungast@mailsac.com' },
  'https://nhungast.io/resetPassword'
);
process.env.NODE_ENV = 'production';
emailSender.send('template', 'Reset Password Test');
