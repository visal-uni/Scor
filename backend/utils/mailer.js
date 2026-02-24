import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendCode = async (email, code) => {
  await transporter.sendMail({
    from: `"Auth App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your identity",
    html: `
    <div style="font-family: Arial, sans-serif; background:#f6f8fa; padding:40px 0;">
      <div style="max-width:520px;margin:auto;background:white;border:1px solid #e1e4e8;
                  border-radius:8px;padding:32px;text-align:center;">

        <h2 style="margin-top:0;color:#24292f;">Please verify your identity</h2>

        <p style="color:#57606a;font-size:14px;">
          Here is your authentication code:
        </p>

        <div style="
            font-size:36px;
            font-weight:bold;
            letter-spacing:6px;
            margin:20px 0;
            color:#24292f;
        ">
          ${code}
        </div>

        <p style="font-size:14px;color:#57606a;">
          This code is valid for <b>5 minutes</b> and can only be used once.
        </p>

        <p style="font-size:13px;color:#8c959f;margin-top:24px;">
          Please don’t share this code with anyone.
          Our team will never ask for it.
        </p>

      </div>

      <p style="text-align:center;font-size:12px;color:#8c959f;margin-top:20px;">
        If you didn’t request this code, you can safely ignore this email.
      </p>
    </div>
    `
  });
};