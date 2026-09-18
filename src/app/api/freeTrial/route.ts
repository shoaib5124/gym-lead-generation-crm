import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FreeTrial from "@/models/freeTrial";
import { Stats } from "@/app/components/Stats";

export async function POST(request: Request) {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Get data sent by the frontend
    const data = await request.json();

    // 3. Save data using the Mongoose model
    const freeTrial = await FreeTrial.create(data);

    // 4. Send success response
    return NextResponse.json(
      {
        message: "Free trial submitted successfully",
        freeTrial,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Get query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");

    // 3. Build MongoDB query
    let query = FreeTrial.find().sort({ createdAt: -1 });

    // 4. Apply limit only if provided
    if (limitParam) {
      const limit = Number(limitParam);

      if (limit > 0) {
        query = query.limit(limit);
      }
    }

    // 5. Execute query
    const leads = await query;

    // Calculate dashboard statistics
    const stats = await FreeTrial.aggregate([
      {
        $facet: {
          total: [
            { $count: "count" }
          ],

          new: [
            { $match: { status: "new" } },
            { $count: "count" }
          ],

          contacted: [
            { $match: { status: "contacted" } },
            { $count: "count" }
          ],

          converted: [
            { $match: { status: "converted" } },
            { $count: "count" }
          ]
        }
      }
    ]);
    const result = stats[0];

    const dashboardStats = {
      total: result.total[0]?.count || 0,
      new: result.new[0]?.count || 0,
      contacted: result.contacted[0]?.count || 0,
      converted: result.converted[0]?.count || 0
    };

    // 6. Send leads to dashboard
    return NextResponse.json(
      {
        leads,
        stats: dashboardStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}