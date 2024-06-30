import connToDb from "@/db/connectToDb";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connToDb();

export async function GET(req: NextRequest) {
  try {
    const userId = getDataFromToken(req);
    const user = await User.findOne({
      _id: userId,
    }).select("-password");

    return NextResponse.json({
      statusCode: 200,
      message: "User Fetch Successfully",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({
      statusCode: 500,
      message: "Something went worng while to verify user",
      error: error.message,
    });
  }
}
