import connToDb from "@/db/connectToDb";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connToDb();

export async function POST(req: NextRequest) {
  try {
    const userId = await getDataFromToken(req);
    const user = await User.findOne({ _id: userId }).select("-password");
    return NextResponse.json({
      mesaaage: "User found",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
