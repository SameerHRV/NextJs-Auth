import connToDb from "@/db/connectToDb";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connToDb();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;
    console.log(reqBody);

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({
        statusCode: 400,
        message: "Invalid Token",
      });
    }
    console.log(user);

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;

    const savedUser = await user.save();

    return NextResponse.json({
      statusCode: 200,
      message: "User Verified Successfully",
      data: savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({
      statusCode: 500,
      message: "Something went worng while to verify user",
      error: error.message,
    });
  }
}
