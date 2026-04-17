import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendPasswordResetEmail(to: string, code: string) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "TeacherPoa Password Reset Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>TeacherPoa Password Reset</h2>
        <p>Your 6-digit reset code is:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">
          ${code}
        </p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
    text: `Your TeacherPoa reset code is ${code}. It expires in 10 minutes.`,
  })
}