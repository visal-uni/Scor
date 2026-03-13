import jwt from "jsonwebtoken";
import { sendCode } from "../utils/mailer.js";
import { saveOTP, verifyOTP } from "../utils/otpStore.js";

export const requestCode = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ msg: "Email required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  saveOTP(email, code);
  await sendCode(email, code);

  res.json({ msg: "Verification code sent to email" });
};

export const verifyCode = (req, res) => {
  const { email, code } = req.body;

  const valid = verifyOTP(email, code);
  if (!valid) return res.status(400).json({ msg: "Invalid or expired code" });

  // Only confirm that the code is valid.
  // The actual account creation & login are handled in userController.register.
  res.json({ msg: "Code verified" });
};