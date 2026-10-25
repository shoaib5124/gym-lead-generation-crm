"use client";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import LeadHeader from "@/app/components/dashboard/lead/LeadHeader";
import { ContactInformation } from "@/app/components/dashboard/lead/ContactInformation";
import {LeadStatus} from "@/app/components/dashboard/lead/LeadStatus";
import {LeadPurpose} from "@/app/components/dashboard/lead/LeadPurpose";
// import {FollowUp} from "@/app/components/leads/FollowUp";
import { Notes} from "@/app/components/dashboard/lead/Notes";
import { deleteNoteApi, ApiError } from "@/lib/api/notes";
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




interface FollowUp {
  date: string;
  time: string;
  reason: string;
}

interface LeadDetailsPageProps {
  params: Promise<{ id: string }>;
}






const getInitials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function LeadDetailsPage({
  params,
}: LeadDetailsPageProps) {
  const { id } = use(params);



  const [deletingNoteId, setDeletingNoteId] =
    useState<string | null>(null);

  const [lead, setLead] = useState<Lead | null>(null);

  const [statusLoading, setstatusLoading] = useState(false);

  const [notes, setNotes] = useState<Note[]>([]);

  const [followUp, setFollowUp] = useState<FollowUp | null>(null);

  const [pageState, setPageState] =
    useState<PageState>("loading");

  const [delLoading, setdelLoading] = useState(false);

  const [error, setError] = useState("");

  const [noteText, setNoteText] = useState("");

  const [editingNoteId, setEditingNoteId] =
    useState<string | null>(null);

  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [followUpReason, setFollowUpReason] = useState("");

  const [showFollowUpForm, setShowFollowUpForm] =
    useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [copied, setCopied] = useState(false);

  //////////////////////// Copy Email ////////////////////////

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

  //////////////////////// Add Note API ////////////////////////

  const handleSaveNote = async (id: string) => {
    try {
      const response = await fetch(
        `/api/freeTrial/${id}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ noteText }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to add note");
      }

      setNoteText("");

      setNotes(data.lead.notes);
    } catch (error) {
      console.error("Error while adding Note", error);
    }
  };

  //////////////////////// Schedule Follow Up ////////////////////////
  const handleScheduleFollowUp = () => {
    if (
      !followUpDate ||
      !followUpTime ||
      !followUpReason.trim()
    ) {
      setError("Please complete all follow-up fields.");
      return;
    }

    setFollowUp({
      date: followUpDate,
      time: followUpTime,
      reason: followUpReason.trim(),
    });

    setShowFollowUpForm(false);

    setError("");
  };

  //////////////////////// Delete Note API ////////////////////////

  const handleDeleteNote = async (
  leadId: string,
  noteId: string
) => {
  // Edge case 1: Invalid noteId
  if (!noteId || typeof noteId !== "string" || noteId.trim() === "") {
    toast.error("Invalid note ID. Cannot delete.");
    return;
  }

  // Edge case 2: No internet
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    toast.error("No internet connection. Please check your network.");
    return;
  }

  setDeletingNoteId(noteId);

  try {
    const data = await deleteNoteApi(leadId, noteId);

    // Success
    setNotes((previousNotes) =>
      previousNotes.filter((note) => note._id !== noteId)
    );
    toast.success(data?.message || "Note deleted successfully.");
  } catch (error) {
    console.error("Delete note error:", error);

    // Typed API error — map status to toast
    if (error instanceof ApiError) {
      switch (error.status) {
        case 404:
          toast.error(
            error.message || "Note not found. It may have been already deleted."
          );
          // Sync UI — remove ghost note
          setNotes((previousNotes) =>
            previousNotes.filter((note) => note._id !== noteId)
          );
          break;
        case 401:
        case 403:
          toast.error(error.message || "You are not authorized to delete this note.");
          break;
        case 400:
          toast.error(error.message || "Invalid request. Please refresh and try again.");
          break;
        case 500:
          toast.error(error.message || "Server error. Please try again later.");
          break;
        default:
          toast.error(error.message || "Failed to delete note. Please try again.");
      }
      return;
    }

    // Network error (fetch threw TypeError)
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      toast.error("Network error. Please check your internet connection.");
      return;
    }

    // Unknown error
    toast.error("Unable to connect to the server. Please try again.");
  } finally {
    setDeletingNoteId(null);
  }
};

  //////////////////////// Edit Note API ////////////////////////

  const handleUpdateNote = async (
    leadId: string,
    noteId: string,
    newText: string
  ) => {
    try {
      const response = await fetch(
        `/api/freeTrial/${id}/notes/${noteId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: newText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update note"
        );
      }

      console.log("Updated lead:", data.updatedLead);

      setNotes(data.updatedLead.notes);

      setEditingNoteId(null);

      setNoteText("");
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  //////////////////////// Update Lead Status API ////////////////////////

  const updateLeadStatus = async (
    id: string,
    status?: LeadStatus
  ) => {
    try {
      const response = await fetch(
        `/api/freeTrial/${id}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log(data);

      return data.lead;
    } catch (error) {
      console.error("error accured", error);
    }
  };

  //////////////////////// Fetch Lead By ID ////////////////////////

  async function fetchLeadById(id: string) {
    try {
      const response = await fetch(
        `/api/freeTrial/${id}`
      );

      if (response.status === 404) {
        setPageState("not-found");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch lead");
      }

      const data = await response.json();

      setLead(data.lead);

      setNotes(data.lead.notes);

   

      setPageState("success");
    } catch (error) {
      console.error("Could not get lead", error);

      setPageState("error");
    }
  }

  useEffect(() => {
    fetchLeadById(id);
  }, [id]);

  //////////////////////// Delete Lead API ////////////////////////

  const handleDeleteLead = async (id: string) => {
    try {
      setdelLoading(true);

      const response = await fetch(
        `/api/freeTrial/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete lead"
        );
      }

      setLead(null);

      setPageState("deleted");
    } catch (error) {
      console.error("DeleteError", error);
    } finally {
      setdelLoading(false);
    }
  };

  //////////////////////// Loading State ////////////////////////

  if (pageState === "loading") {
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
 
  //////////////////////// Error State ////////////////////////

  if (pageState === "error") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {error}
          </p>

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

  //////////////////////// Not Found State ////////////////////////

  if (pageState === "not-found") {
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

  //////////////////////// Deleted State ////////////////////////

  if (pageState === "deleted") {
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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/10 text-lime-400">
              ✓
            </div>

            <h2 className="mt-4 text-lg font-bold">
              Lead deleted successfully
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              This lead has been successfully removed from your CRM.
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

  //////////////////////// Main Page ////////////////////////

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
         <LeadHeader
            setLead={setLead}
            lead={lead}
            statusLoading={statusLoading}
            setstatusLoading={setstatusLoading}
            copied={copied}
            id={id}
            onCopyEmail={handleCopyEmail}
            updateLeadStatus={updateLeadStatus}
          />
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
          <ContactInformation
          copied={copied}
          setcopied={setCopied}
           lead={lead}
           handleCopyEmail={handleCopyEmail}

           />

           
           <LeadPurpose lead={lead}/>

            {/* NOTES */}
           <Notes
              notes={notes}
              editingNoteId={editingNoteId}
              noteText={noteText}
              id={id}
              setNoteText={setNoteText}
              handleUpdateNote={handleUpdateNote}
              handleSaveNote={handleSaveNote}
              setEditingNoteId={setEditingNoteId}
              handleDeleteNote={handleDeleteNote}
              deletingNoteId={deletingNoteId}
           />
          </div>

          {/* RIGHT COLUMN */}

          <div className="space-y-6">

            {/* STATUS MANAGEMENT */}
          <LeadStatus
           setLead={setLead}
           lead={lead}
           statusLoading={statusLoading}
           setstatusLoading={setstatusLoading}
           id={id}
           updateLeadStatus={updateLeadStatus}
          />
            

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
                    onClick={() =>
                      setShowFollowUpForm(true)
                    }
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
                onClick={() =>
                  setShowFollowUpForm(
                    (previous) => !previous
                  )
                }
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
                        setFollowUpDate(
                          event.target.value
                        )
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
                        setFollowUpTime(
                          event.target.value
                        )
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
                        setFollowUpReason(
                          event.target.value
                        )
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
              onClick={() => handleDeleteLead(id)}
              disabled={delLoading}
              className="min-h-11 rounded-xl bg-red-500 px-4 text-sm font-bold text-white hover:bg-red-400"
            >
              {delLoading ? "Deleting" : "Delete Lead"}
            </button>

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
                This is a dummy deletion. In the real
                application, the backend must validate
                the request before permanently deleting
                a lead.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteConfirm(false)
                  }
                  className="min-h-11 rounded-xl border border-white/10 px-4 text-sm font-semibold text-zinc-300 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteLead(id)
                  }
                  disabled={delLoading}
                  className="min-h-11 rounded-xl bg-red-500 px-4 text-sm font-bold text-white hover:bg-red-400"
                >
                  {delLoading
                    ? "Deleting"
                    : "Delete Lead"}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
