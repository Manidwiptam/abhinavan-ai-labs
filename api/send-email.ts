import nodemailer from 'nodemailer';
import cors from 'cors';

const handler = async (req: Request, res: Response) => {
  // CORS middleware
  cors()(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { name, email, message } = await req.json();

      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'your-gmail@gmail.com',
          pass: process.env.EMAIL_PASS || 'your-app-password',
        },
      });

      const mailOptions = {
        from: email,
        to: 'team.abhinavan@gmail.com',
        subject: `New Contact from ${name}`,
        text: `Message from ${name} (${email}):\n\n${message}`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });
};

export { handler as POST };
