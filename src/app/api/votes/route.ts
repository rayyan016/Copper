import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Poll from "@/models/Poll";

// Handle POST request (Voting on a poll)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { pollId, optionIndex } = await req.json();

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    return NextResponse.json(poll, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
