import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import FreeTrial from "@/models/freeTrial";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get ID from URL
    const { id } = await params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid lead ID" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find one lead
    const lead = await FreeTrial.findById(id).lean();

    // Lead doesn't exist
    if (!lead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      );
    }

    // Send lead to frontend
    return NextResponse.json(
      { lead },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET LEAD ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}