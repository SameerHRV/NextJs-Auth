import { User } from "@/models/user.model";
import createHttpError from "http-errors";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verificationToken: hashedToken,
        verificationExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      });
    } else if (emailType === "RESET PASSWORD") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20), // 20 days
      });
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "4a04ac3be08d98",
        pass: "b2bf87b3a7a2eb",
      },
    });

    const mailOptions = {
      from: "sameerharapanahalli5@gmail.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify Your Email" : "RESET PASSWORD",
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "RESET PASSWORD"
      }
            or copy and paste the link below in your browser. <br> ${
              process.env.DOMAIN
            }/verifyemail?token=${hashedToken}
            </p>`,
    };

    const mailRespons = await transporter.sendMail(mailOptions);

    return mailRespons;
  } catch (error: any) {
    const errMessage = createHttpError(500, "Something went worng while to send mail", error.message);
    throw errMessage;
  }
};

export default sendMail;
