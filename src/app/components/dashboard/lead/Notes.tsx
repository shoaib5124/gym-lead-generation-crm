import React from 'react';
import {Note} from '@/app/types' 

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

interface NotesProps {
  notes: Note[];
  editingNoteId: string | null;
  setEditingNoteId: React.Dispatch<React.SetStateAction<string | null>>;
  noteText: string;
  setNoteText: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  handleUpdateNote: (
    leadId: string,
    noteId: string,
    newText: string
  ) => Promise<void>;
  handleSaveNote: (id: string) => Promise<void>;
  handleDeleteNote: (leadId: string | null, noteId: string | null) => Promise<void>;
  deletingNoteId: string | null;
}

export const Notes = ({
  notes,
  editingNoteId,
  noteText,
  id,
  setNoteText,
  handleUpdateNote,
  handleSaveNote,
  setEditingNoteId,
  handleDeleteNote,
  deletingNoteId,
}: NotesProps) => {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-white">Notes</h3>
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
            onClick={async () => {
              if (editingNoteId) {
                await handleUpdateNote(id, editingNoteId, noteText);
              } else {
                await handleSaveNote(id);
              }
            }}
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
            <p className="text-sm text-zinc-500">No notes yet.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border border-white/10 bg-[#0A0A0A] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
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
                    onClick={() => {
                      setEditingNoteId(note._id ?? null);
                      setNoteText(note.text);
                    }}
                    className="text-xs font-semibold text-zinc-500 hover:text-lime-300"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => 
                      handleDeleteNote(id, note._id?? null)}
                    disabled={deletingNoteId === note._id}
                    className="text-xs font-semibold text-zinc-500 hover:text-red-400 disabled:opacity-50"
                  >
                    {deletingNoteId === note._id ? "Deleting..." : "Delete"}
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
  );
};