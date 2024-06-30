import connToDb from "@/db/connectToDb";
import sendMail from "@/helpers/mailer";
import { User } from "@/models/user.model";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json({
        statusCode: 400,
        message: "User Already Exist",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await User.create({
      name: name.toLowerCase(),
      email,
      password: hashedPassword,
    });

    const createNewUser = await User.findById(newUser._id).select("-password");

    const savedUser = await createNewUser.save();

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
    return NextResponse.json({
      statusCode: 500,
      message: "Something went worng while to register user",
      error: error.message,
    });
  }
}
