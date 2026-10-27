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

    // 3. Save the lead to MongoDB
    const freeTrial = await FreeTrial.create(data);

    // 4. Notify n8n after the lead has been saved
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    const n8nSecret = process.env.N8N_WEBHOOK_SECRET;

    if (n8nUrl && n8nSecret) {
      try {
        const n8nResponse = await fetch(n8nUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": n8nSecret,
          },
          body: JSON.stringify({
            name: freeTrial.name,
            email: freeTrial.email,
            phone: freeTrial.phone,
            purpose: freeTrial.purpose,
          }),
          signal: AbortSignal.timeout(10000),
        });

        if (!n8nResponse.ok) {
          console.error(
            "n8n webhook failed:",
            n8nResponse.status,
            await n8nResponse.text()
          );
        }
      } catch (n8nError) {
        // The lead is already saved, so don't report the submission as failed.
        console.error("Failed to notify n8n:", n8nError);
      }
    } else {
      console.error("Missing N8N_WEBHOOK_URL or N8N_WEBHOOK_SECRET");
    }

    // 5. Return success
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