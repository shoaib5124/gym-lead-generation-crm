import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import FreeTrial from "@/models/freeTrial";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      noteId: string;
    }>;
  }
) {
  try {
    await connectDB();

    const { id, noteId } = await params;

    const { text } = await req.json();

    // Validate text
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Note text is required" },
        { status: 400 }
      );
    }
   console.log(noteId)
    // Find lead
    const lead = await FreeTrial.findById(id);

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    // Find specific note
    const note = lead.notes.id(noteId);

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    // Update note
    note.text = text.trim();

    await lead.save();

    return NextResponse.json(
      {
        message: "Note updated successfully",
        updatedLead: lead,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update note error:", error);

    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request:Request,
{params}:
{params: 
  Promise<{
    noteId: string, 
    id:string
  }>}
){
  try{
   const { id, noteId } = await params;

// Validate IDs first
if (
  !mongoose.Types.ObjectId.isValid(id) ||
  !mongoose.Types.ObjectId.isValid(noteId)
) {
  return NextResponse.json(
    { message: "Invalid ID" },
    { status: 400 }
  );
}

// Find lead
const lead = await FreeTrial.findById(id);

if (!lead) {
  return NextResponse.json(
    { message: "Lead not found" },
    { status: 404 }
  );
}

// Check whether note exists
const noteExists = lead.notes.some(
  (note) => note._id.toString() === noteId
);

if (!noteExists) {
  return NextResponse.json(
    { message: "Note not found" },
    { status: 404 }
  );
}

    // Delete note
    const updatedLead = await FreeTrial.findByIdAndUpdate(
      id,
      {
        $pull: {
          notes: { _id: noteId },
        },
      },
      { returnDocument: "after" }
    );

    return NextResponse.json(
      {
        message: "Note deleted successfully",
        lead: updatedLead,
      },
      { status: 200 }
    );

     console.log("Lead ID:", id);
console.log("Note ID from params:", noteId);
console.log("Notes:", updatedLead.notes);
  }catch(error){
    console.error("Error while deleting note:", error)
    return NextResponse.json(
      {message:"Failed to delete note"},
      {status: 500}
    )
  }
}
