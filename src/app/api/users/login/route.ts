import connToDb from "@/db/connectToDb";
import { User } from "@/models/user.model";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connToDb();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return NextResponse.json({
        statusCode: 400,
        message: "Invalid Credentials",
      });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({
        statusCode: 400,
        message: "Invalid Credentials",
      });
    }

    const JwtToken = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(JwtToken, process.env.JWT_TOKEN_SECRET!, {
      expiresIn: process.env.JWT_EXPIRATION!,
    });

    const res = NextResponse.json({
      statusCode: 200,
      success: true,
      message: "User Logged In Successfully",
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({
      statusCode: 500,
      message: "Something went worng while to logout user",
      error: error.message,
    });
  }
}
