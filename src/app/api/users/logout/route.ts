import connToDb from "@/db/connectToDb";
import { NextRequest, NextResponse } from "next/server";

connToDb();

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({
      statusCode: 200,
      success: true,
      message: "User Logged Out Successfully",
    });

    res.cookies.set("token", "", {
      httpOnly: true,
      secure: true,
      maxAge: -1,
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
