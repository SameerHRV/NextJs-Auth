import connToDb from "@/db/connectToDb";
import { User } from "@/models/user.model";
import createHttpError from "http-errors";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import sendMail from "@/helpers/mailer";

connToDb();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { name, email, password } = reqBody;

    console.log(reqBody);

    const user = await User.findOne({
      $or: [{ email }, { name }],
    });

    if (user) {
      const errMsg = createHttpError(400, "User Already Exist");
      NextResponse.json({
        statusCode: errMsg.statusCode,
        message: errMsg.message,
      });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save({
      validateBeforeSave: false,
    });

    console.log(savedUser);
    // send mail to user
    await sendMail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });

    return NextResponse.json({
      statusCode: 200,
      message: "User Registered Successfully",
      data: savedUser,
    });
  } catch (error: any) {
    const errMsg = createHttpError(500, "Something went worng while to register user", error.message);
    NextResponse.json({
      statusCode: errMsg.statusCode,
      message: errMsg.message,
    });
  }
}
