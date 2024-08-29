import nodemailer from 'nodemailer';
import axios from 'axios';

interface Config {
  BREVO_SMTP_SERVER: string;
  BREVO_SMTP_PORT: number;
  BREVO_SMTP_LOGIN: string;
  BREVO_SMTP_PASSWORD: string;
  BREVO_SMTP_API_KEY: string;
  BREVO_LIST_ID: number;
}

const config: Config = {
  BREVO_SMTP_SERVER: process.env.BREVO_SMTP_SERVER!,
  BREVO_SMTP_PORT: parseInt(process.env.BREVO_SMTP_PORT!, 10),
  BREVO_SMTP_LOGIN: process.env.BREVO_SMTP_LOGIN!,
  BREVO_SMTP_PASSWORD: process.env.BREVO_SMTP_PASSWORD!,
  BREVO_SMTP_API_KEY: process.env.BREVO_SMTP_API_KEY!,
  BREVO_LIST_ID: parseInt(process.env.BREVO_LIST_ID!, 10),
};

const transporter = nodemailer.createTransport({
  host: config.BREVO_SMTP_SERVER,
  port: config.BREVO_SMTP_PORT || 587,
  secure: false,
  auth: {
    user: config.BREVO_SMTP_LOGIN,
    pass: config.BREVO_SMTP_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

export const sendVerificationEmail = async (email: string, userId: string) => {
  const url = new URL('http://localhost:3000');
  const verificationLink = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}/api/auth?userId=${userId}`;

  const mailOptions = {
    from: '"Chat App" <noreply@atakangul.com>',
    to: email,
    subject: 'Verify your email',
    html: `Please click <a href="${verificationLink}">here</a> to verify your email.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.response);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendVerificationCode = async (email: string, code: string) => {
  const mailOptions = {
    from: '"Chat App" <noreply@atakangul.com>',
    to: email,
    subject: 'Verify your email',
    html: `Your verification code is ${code}.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification code sent:', info.response);
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
};
