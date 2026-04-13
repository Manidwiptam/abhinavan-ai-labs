import nodemailer from 'nodemailer';

export default async function (req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { name, email, message } = req.body;

console.log('ENV:', { user: !!process.env.EMAIL_USER, pass: !!process.env.EMAIL_PASS });
    console.log('USER preview:', process.env.EMAIL_USER?.slice(0,10)+'...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER?.trim(),
        pass: process.env.EMAIL_PASS?.replace(/\s/g,''),
      },
    });

    await transporter.verify();
    console.log('SMTP Auth OK');
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'team.abhinavan@gmail.com',
      subject: `New Contact from ${name}`,
      html: `
        <h3>New Message from ${name}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}

