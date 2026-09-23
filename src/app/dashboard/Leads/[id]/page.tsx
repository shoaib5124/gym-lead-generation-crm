"use client";
import FreeTrial from "@/models/freeTrial";
import Link from "next/link";
import { NextResponse } from "next/server";
import { use, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}
type PageState =
  | "loading"
  | "success"
  | "not-found"
  | "deleted"
  | "error";

type LeadStatus =
  | "new"
  | "contacted"
  | "Notresponed"
  | "interested"
  | "trial-booked"
  | "joined";

type ActivityType =
  | "created"
  | "status_changed"
  | "note_added"
  | "followup_created";

interface Note {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

interface FollowUp {
  date: string;
  time: string;
  reason: string;
}

interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  createdAt: string;
}

interface LeadDetailsPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "contacted",
  "interested",
  "trial-booked",
  "joined",
];

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  Notresponed: "Not-Responed",
  "trial-booked": "Trial Booked",
  joined: "Joined",
};

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "border-lime-400/20 bg-lime-400/10 text-lime-300",
  contacted: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  interested: "border-purple-400/20 bg-purple-400/10 text-purple-300",
  Notresponed: "border-blue-400/20 bg-lime-400  text-purple-300",
  "trial-booked":
    "border-orange-400/20 bg-orange-400/10 text-orange-300",
  joined: "border-lime-400 bg-lime-400 text-black",
};
const initialNotes: Note[] = [
  {
    id: "note-1",
    text: "Ali prefers morning workouts and has a busy schedule on weekends.",
    author: "Admin",
    createdAt: "2026-09-19T11:20:00",
  },
];

const initialActivities: Activity[] = [
  {
    id: "activity-1",
    type: "created",
    description: "Lead submitted the free trial form.",
    createdAt: "2026-09-19T10:24:00",
  },
];

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "created":
      return "user-plus";
    case "status_changed":
      return "arrow-right";
    case "note_added":
      return "message-square";
    case "followup_created":
      return "calendar-clock";
    default:
      return "circle";
  }
};

export default function LeadDetailsPage({
  params,
}: LeadDetailsPageProps) {
  const { id } = use(params);

  const [lead, setLead] = useState<Lead | null>(null);
  const [statusLoading, setstatusLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activities, setActivities] =
    useState<Activity[]>(initialActivities);

  const [followUp, setFollowUp] = useState<FollowUp | null>(null);

  const [pageState, setPageState] = useState<PageState>("loading");
  const [delLoading, setdelLoading] = useState(false);
  const [error, setError] = useState("");

  const [noteText, setNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(
    null
  );

  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [followUpReason, setFollowUpReason] = useState("");

  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [copied, setCopied] = useState(false);
  const sortedActivities = useMemo(
    () =>
      [...activities].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ),
    [activities]
  );

  const addActivity = (
    type: ActivityType,
    description: string
  ) => {
    setActivities((previous) => [
      {
        id: crypto.randomUUID(),
        type,
        description,
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ]);
  };
  const handleCopyEmail = async () => {
    if (!lead) return;

    try {
      await navigator.clipboard.writeText(lead.email);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy email.");
    }
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;

    if (editingNoteId) {
      setNotes((previous) =>
        previous.map((note) =>
          note.id === editingNoteId
            ? { ...note, text: noteText }
            : note
        )
      );

      setEditingNoteId(null);
      setNoteText("");
      return;
    }

    const newNote: Note = {
      id: crypto.randomUUID(),
      text: noteText.trim(),
      author: "Admin",
      createdAt: new Date().toISOString(),
    };

    setNotes((previous) => [newNote, ...previous]);

    addActivity("note_added", "A new note was added.");

    setNoteText("");
  };

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setNoteText(note.text);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((previous) =>
      previous.filter((note) => note.id !== noteId)
    );

    if (editingNoteId === noteId) {
      setEditingNoteId(null);
      setNoteText("");
    }
  };

  const handleScheduleFollowUp = () => {
    if (!followUpDate || !followUpTime || !followUpReason.trim()) {
      setError("Please complete all follow-up fields.");
      return;
    }

    setFollowUp({
      date: followUpDate,
      time: followUpTime,
      reason: followUpReason.trim(),
    });

    addActivity(
      "followup_created",
      `Follow-up scheduled for ${followUpDate} at ${followUpTime}.`
    );

    setShowFollowUpForm(false);
    setError("");
  };
//////////////////////// Update Lead Staus API Call/////////////////////////////////////
const updateLeadStatus = async(
  id: string,
  status: LeadStatus,
)=>{
 try{
  const response = await fetch(`/api/freeTrial/${id}`,
    {method:"PATCH",
     headers: {
          "content-type": "application/json"
         }, 
         body: JSON.stringify(
          {status}
         )
    }
  )

  const data = await response.json();
     
  if (!response.ok){
    throw new Error(data.message)
  }
  console.log(data)
  return data.lead;

 }
 catch(error){
  console.error("error accured", error)
 }
}
//////////////////////// Fetching lead data build/////////////////////////////////////
async function fetchLeadById(id: string) {
  try{
    
    const response = await fetch(`/api/freeTrial/${id}`);

    if(response.status == 404){
      setPageState("not-found")
      return;
    }
    if(!response.ok){
    
    throw new Error("Failed to fetch lead")
  }
    const data = await response.json();
    setLead(data.lead)
    setPageState("success")

  }
  catch(error){
    console.error("Could not get lead", error);
      setPageState("error")
  } 
}
useEffect(()=>{
  fetchLeadById(id);
},[id])
///////////////////////////////// Call Delete Api ///////////////////////////////////
  const handleDeleteLead = async (id: string) => {
    // call delete API
    try{
      setdelLoading(true);
      const response = await fetch(`/api/freeTrial/${id}`,
        {method: "DELETE"}
        
      );
      const data = await response.json();
      setLead(null)
      setPageState("deleted")
   

    if(!response.ok){
      throw new Error(data.message  || "Failed to delete lead" );  
      }  
   
  }
  catch(error){
   console.error("DeleteError", error);
  }finally{
    setdelLoading(false)
  }
  };
//////////////////////// Return Sekelten if loading is true ////////////////////////////
  if (pageState== "loading") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-4 text-white sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-5 w-32 rounded bg-zinc-800" />
          <div className="h-36 rounded-2xl bg-zinc-900" />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-64 rounded-2xl bg-zinc-900" />
            <div className="h-64 rounded-2xl bg-zinc-900" />
          </div>

          <div className="h-80 rounded-2xl bg-zinc-900" />
        </div>
      </div>
    );
  }

  if (pageState=="error") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-zinc-500">{error}</p>

          <Link
            href="/dashboard/leads"
            className="mt-6 inline-flex rounded-lg bg-lime-400 px-4 py-2.5 text-sm font-bold text-black"
          >
            Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  if (pageState =="not-found") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-4 text-white sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/dashboard/Leads"
            className="text-sm text-zinc-400 hover:text-lime-400"
          >
            ← Back to Leads
          </Link>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
              !
            </div>

            <h2 className="mt-4 text-lg font-bold">
              Lead not found
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              This lead may have been deleted or the ID is invalid.
            </p>

            <Link
              href="/dashboard/Leads"
              className="mt-6 inline-flex rounded-lg bg-lime-400 px-4 py-2.5 text-sm font-bold text-black"
            >
              Back to Leads
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (pageState === "deleted") {
     return (
       <div className="min-h-screen bg-[#0A0A0A] p-4 text-white sm:p-6 lg:p-8"> <div 
         className="mx-auto max-w-2xl">
          <Link href="/dashboard/Leads" className="text-sm text-zinc-400 hover:text-lime-400" > ←  Back to Leads
          </Link>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center"> 
         <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/10 text-lime-400"> 
            ✓ 
         </div> 
         <h2 className="mt-4 text-lg font-bold">
           Lead deleted successfully 
         </h2>
         <p className="mt-2 text-sm text-zinc-500">
           This lead has been successfully removed from your CRM. 
         </p> 
         <Link href="/dashboard/Leads" className="mt-6 inline-flex rounded-lg bg-lime-400 px-4 py-2.5 text-sm font-bold text-black" >
           Back to Leads 
          </Link> 
        </div>
      </div>
    </div> ); }
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* BACK + PAGE TITLE */}

        <div>
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-lime-400"
          >
            <span aria-hidden="true">←</span>
            Back to All Leads
          </Link>

          <div className="mt-5">
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Lead Details
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              View and manage your gym prospect
            </p>
          </div>
        </div>

        {/* LEAD PROFILE HEADER */}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex min-w-0 items-center gap-4">

              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-lg font-bold text-lime-400 ring-1 ring-lime-400/20"
              >
                {getInitials(lead.name)}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-white sm:text-2xl">
                  {lead.name}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                  <span>
                    ID: #{lead._id.slice(0, 8)}
                  </span>

                  <span aria-hidden="true">·</span>

                  <span>
                    Created {formatDate(lead.createdAt)}
                  </span>
                </div>
              </div>

            </div>

            <div className=" flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative  w-32">
                 {statusLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-lime-400" />
                    </div>
                ):
                (<select
                  value={lead?.status}
                  onChange={ async (event) =>{
                  try{ 
                      setstatusLoading(true)
                      const newStatus = event.target.value as LeadStatus;
                      const updatedLead = await updateLeadStatus(id,newStatus);
                      if (updatedLead){
                      setLead(updatedLead);
                      toast.success("Lead status updated successfully");
                  }
                  }finally{
                    setstatusLoading(false)
                  }
                  
                  }
                }
                  aria-label="Change lead status"
                  className="min-h-11 rounded-xl border border-white/10 bg-[#111111] px-3 text-sm font-semibold text-zinc-200 outline-none transition focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
                )}
              </div>
              <div className="flex flex-wrap gap-2">

                <a
                  href={`tel:${lead.phone}`}
                  aria-label="Call lead"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-300"
                >
                  ☎ Call
                </a>

                <a
                  href={`mailto:${lead.email}`}
                  aria-label="Email lead"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-300"
                >
                  ✉ Email
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-300"
                >
                  {copied ? "Copied" : "Copy"}
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* ERROR MESSAGE */}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
          >
            {error}

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-3 underline underline-offset-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TWO COLUMN CONTENT */}

        <div className="grid items-start gap-6 lg:grid-cols-2">

          {/* LEFT COLUMN */}

          <div className="space-y-6">

            {/* CONTACT INFORMATION */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-white">
                  Contact Information
                </h3>

                <span className="text-xs text-zinc-600">
                  Profile
                </span>
              </div>

              <div className="mt-5 space-y-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Full Name
                  </p>

                  <p className="mt-1 text-sm text-zinc-200">
                    {lead.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Email
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="break-all text-sm text-zinc-200">
                      {lead.email}
                    </p>

                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="text-xs font-semibold text-lime-400 hover:text-lime-300"
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Phone
                  </p>

                  <a
                    href={`tel:${lead.phone}`}
                    className="mt-1 inline-block text-sm text-zinc-200 hover:text-lime-300"
                  >
                    {lead.phone}
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Lead Source
                    </p>

                    <p className="mt-1 text-sm text-zinc-200">
                      {lead.source}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Created
                    </p>

                    <p className="mt-1 text-sm text-zinc-200">
                      {formatDate(lead.createdAt)}
                    </p>
                  </div>

                </div>

              </div>

            </section>

            {/* LEAD PURPOSE */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

              <h3 className="text-base font-bold text-white">
                Lead Purpose / Fitness Goal
              </h3>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                {lead.purpose}
              </p>

            </section>

            {/* NOTES */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-white">
                  Notes
                </h3>

                <span className="text-xs text-zinc-500">
                  {notes.length} {notes.length === 1 ? "note" : "notes"}
                </span>
              </div>

              <div className="mt-5">

                <label
                  htmlFor="lead-note"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  {editingNoteId ? "Edit Note" : "Add Note"}
                </label>

                <textarea
                  id="lead-note"
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  placeholder="Write a note about your conversation..."
                  rows={4}
                  className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#0A0A0A] p-3 text-sm leading-6 text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20"
                />

                <div className="mt-3 flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={handleSaveNote}
                    disabled={!noteText.trim()}
                    className="min-h-11 rounded-xl bg-lime-400 px-4 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {editingNoteId ? "Save Changes" : "Add Note"}
                  </button>

                  {editingNoteId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNoteId(null);
                        setNoteText("");
                      }}
                      className="min-h-11 rounded-xl border border-white/10 px-4 text-sm font-semibold text-zinc-300 hover:border-white/20"
                    >
                      Cancel
                    </button>
                  )}

                </div>

              </div>

              <div className="mt-6 space-y-3">

                {notes.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                    <p className="text-sm text-zinc-500">
                      No notes yet.
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      Add your first note to track the conversation.
                    </p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-xl border border-white/10 bg-[#0A0A0A] p-4"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          <div
                            aria-hidden="true"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-xs font-bold text-lime-300"
                          >
                            {getInitials(note.author)}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-200">
                              {note.author}
                            </p>

                            <p className="text-xs text-zinc-600">
                              {formatDateTime(note.createdAt)}
                            </p>
                          </div>

                        </div>

                        <div className="flex shrink-0 gap-2">

                          <button
                            type="button"
                            onClick={() => handleEditNote(note)}
                            className="text-xs font-semibold text-zinc-500 hover:text-lime-300"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-xs font-semibold text-zinc-500 hover:text-red-400"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                        {note.text}
                      </p>

                    </div>
                  ))
                )}

              </div>

            </section>

          </div>

          {/* RIGHT COLUMN */}

          <div className="space-y-6">

            {/* STATUS MANAGEMENT */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-white">
                  Lead Status
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[lead.status]}`}
                >
                  {STATUS_LABELS[lead.status]}
                </span>
              </div>

              <div className="mt-5 space-y-2">

                <label
                  htmlFor="lead-status"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  Update Status
                </label>
                <div className="relative">
                  {statusLoading ? (
                    <div className="flex h-10 w-full items-center justify-center rounded-lg border border-zinc-700">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-lime-400" />
                    </div>):
                    (<select
                      id="lead-status"
                      value={lead?.status}
                      onChange={async (event) =>{
                      try{
                        setstatusLoading(true);
                        const newStatus = event.target.value as LeadStatus;
                        const updatedLead = await updateLeadStatus(id, newStatus)
                        if(updatedLead){
                        setLead(updatedLead);
                          toast.success("Lead status updated successfully");
                        }
                      }finally{
                        setstatusLoading(false)
                      }
                      }}
                      className="min-h-12 w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 text-sm text-zinc-200 outline-none focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20"
                      >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                    )}
                </div>    

              </div>

              <div className="mt-6 flex flex-wrap gap-2">

                {STATUS_OPTIONS.map((status) => (
                  <span
                    key={status}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      status === lead.status
                        ? STATUS_STYLES[status]
                        : "border-white/10 bg-white/[0.03] text-zinc-500"
                    }`}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                ))}

              </div>

            </section>

            {/* FOLLOW-UP */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

              <div className="flex items-center justify-between gap-3">

                <h3 className="text-base font-bold text-white">
                  Follow-up
                </h3>

                {followUp && (
                  <span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-300">
                    Scheduled
                  </span>
                )}
0
              </div>

              {followUp ? (
                <div className="mt-5 rounded-xl border border-lime-400/10 bg-lime-400/[0.04] p-4">

                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Next Follow-up
                  </p>

                  <p className="mt-2 text-sm font-semibold text-zinc-200">
                    {followUp.date} · {followUp.time}
                  </p>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Reason
                  </p>

                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    {followUp.reason}
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowFollowUpForm(true)}
                    className="mt-4 text-sm font-semibold text-lime-400 hover:text-lime-300"
                  >
                    Edit Follow-up
                  </button>

                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-white/10 p-5 text-center">

                  <p className="text-sm text-zinc-400">
                    No follow-up scheduled.
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Plan the next action for this lead.
                  </p>

                </div>
              )}

              <button
                type="button"
                onClick={() => setShowFollowUpForm((previous) => !previous)}
                className="mt-4 min-h-11 w-full rounded-xl bg-lime-400 px-4 text-sm font-bold text-black transition hover:bg-lime-300"
              >
                {showFollowUpForm
                  ? "Close Form"
                  : followUp
                  ? "Reschedule Follow-up"
                  : "Schedule Follow-up"}
              </button>

              {showFollowUpForm && (
                <div className="mt-5 space-y-4 border-t border-white/10 pt-5">

                  <div>
                    <label
                      htmlFor="followup-date"
                      className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
                    >
                      Date
                    </label>

                    <input
                      id="followup-date"
                      type="date"
                      value={followUpDate}
                      onChange={(event) =>
                        setFollowUpDate(event.target.value)
                      }
                      className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 text-sm text-zinc-200 outline-none focus:border-lime-400/60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="followup-time"
                      className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
                    >
                      Time
                    </label>

                    <input
                      id="followup-time"
                      type="time"
                      value={followUpTime}
                      onChange={(event) =>
                        setFollowUpTime(event.target.value)
                      }
                      className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 text-sm text-zinc-200 outline-none focus:border-lime-400/60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="followup-reason"
                      className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
                    >
                      Reason
                    </label>

                    <textarea
                      id="followup-reason"
                      value={followUpReason}
                      onChange={(event) =>
                        setFollowUpReason(event.target.value)
                      }
                      rows={3}
                      placeholder="Confirm trial booking..."
                      className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#0A0A0A] p-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-lime-400/60"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleScheduleFollowUp}
                    className="min-h-11 w-full rounded-xl bg-lime-400 px-4 text-sm font-bold text-black hover:bg-lime-300"
                  >
                    Save Follow-up
                  </button>

                </div>
              )}

            </section>

            {/* ACTIVITY TIMELINE */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-white">
                  Activity Timeline
                </h3>

                <span className="text-xs text-zinc-500">
                  {activities.length} events
                </span>
              </div>

              {sortedActivities.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-white/10 p-6 text-center">
                  <p className="text-sm text-zinc-500">
                    No activities yet.
                  </p>
                </div>
              ) : (
                <div className="relative mt-6 space-y-6">

                  <div
                    aria-hidden="true"
                    className="absolute bottom-4 left-4 top-4 w-px bg-white/10"
                  />

                  {sortedActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="relative flex gap-4"
                    >

                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-lime-400/20 bg-[#161616] text-xs text-lime-300">
                        {activity.type === "created"
                          ? "+"
                          : activity.type === "status_changed"
                          ? "→"
                          : activity.type === "note_added"
                          ? "N"
                          : "C"}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                          <p className="text-sm font-semibold text-zinc-200">
                            {activity.type === "created"
                              ? "Lead Created"
                              : activity.type === "status_changed"
                              ? "Status Changed"
                              : activity.type === "note_added"
                              ? "Note Added"
                              : "Follow-up Scheduled"}
                          </p>

                          <span className="text-xs text-zinc-600">
                            {formatDateTime(activity.createdAt)}
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-6 text-zinc-500">
                          {activity.description}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </section>

          </div>

        </div>

        {/* DANGER ZONE */}

        <section className="rounded-2xl border border-red-400/10 bg-red-400/[0.02] p-5 sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h3 className="text-sm font-bold text-zinc-200">
                Danger Zone
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Delete this lead and its associated data.
              </p>
            </div>
             <button
                  type="button"
                  onClick={()=>handleDeleteLead(id)}
                  disabled= {delLoading}
                  className="min-h-11 rounded-xl bg-red-500 px-4 text-sm font-bold text-white hover:bg-red-400"
                >
                  {delLoading ? "Deleting" : "Delete Lead"}
                </button>

            {/* <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="min-h-11 rounded-xl border border-red-400/30 px-4 text-sm font-semibold text-red-400 transition hover:bg-red-400/10"
            >
              Delete Lead
            </button> */}

          </div>

        </section>

        {/* DELETE CONFIRMATION */}

        {showDeleteConfirm && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl">

              <h2
                id="delete-title"
                className="text-lg font-bold text-white"
              >
                Delete this lead?
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                This is a dummy deletion. In the real application,
                the backend must validate the request before
                permanently deleting a lead.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="min-h-11 rounded-xl border border-white/10 px-4 text-sm font-semibold text-zinc-300 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={()=>handleDeleteLead(id)}
                  disabled= {delLoading}
                  className="min-h-11 rounded-xl bg-red-500 px-4 text-sm font-bold text-white hover:bg-red-400"
                >
                  {delLoading ? "Deleting" : "Delete Lead"}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}