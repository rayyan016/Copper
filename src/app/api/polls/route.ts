import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Poll from "@/models/Poll";

// Handle GET request (Fetch all polls)
export async function GET() {
  try {
    await connectDB();
    const polls = await Poll.find().sort({ createdAt: -1 });
    return NextResponse.json(polls, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
