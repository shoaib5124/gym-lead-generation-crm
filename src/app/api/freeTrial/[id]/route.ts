import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import FreeTrial from "@/models/freeTrial";
import mongoose from "mongoose";


/////////////// Get lead by id ///////////////////////////////////////////////////
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

///////////////////////////////// Delete API ///////////////////////////////////////

export async function DELETE(
  request: Request,
{params}:{params: Promise<{id: string}>}
){
try{
await connectDB();
const {id} = await params;
const lead = await FreeTrial.findByIdAndDelete(id);
console.log("Deleted lead:", lead);
if (!lead){
  return NextResponse.json(
    {message: "Lead not found"},
    {status: 404}
  )
  }
   return NextResponse.json(
    {message: " You have deleted lead succesfully"},
    {status: 200}
   )
}

catch(error){
 console.error("Lead deleting erro", error)
  return NextResponse.json(
  {message:"Failed to fetch lead"},
  {status: 500}
);
}
}

///////////////////////////////// Update API ///////////////////////////////////////
export async function PATCH(
  request: Request,
  {params}: {params: Promise<{id:string}>}
) 
{
  try{
    const {id} = await params;
    const body = await request.json();
    const lead = await FreeTrial.findByIdAndUpdate(
      id,
      {status: body.status},
      {new: true, runValidators:true}   
    );
    if (!lead){
    return NextResponse.json(
      {message: " Lead not found"},
      {status: 404}
    )
  }
   return NextResponse.json(
    {message: "lead updated successfully",
    lead: lead,
    },
    {status: 200}
  )
  }
  catch(error){
   console.error("error", error)
   return NextResponse.json(
    {message: "Something went wrong while updating status"},
    {status: 500}
   );

}
}