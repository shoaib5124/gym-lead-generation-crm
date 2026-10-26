"use client";

interface FollowUpData {
  date: Date;
  time: string;
  reason: string;
}

interface FollowUpProps {
  followUp: FollowUpData | null;
  showFollowUpForm: boolean;
  setShowFollowUpForm: (show: boolean | ((previous: boolean) => boolean)) => void;
  followUpDate: string;
  setFollowUpDate: (date: string) => void;
  followUpTime: string;
  setFollowUpTime: (time: string) => void;
  followUpReason: string;
  setFollowUpReason: (reason: string) => void;
  handleScheduleFollowUp: () => void;
}

export const FollowUp = ({
  followUp,
  showFollowUpForm,
  setShowFollowUpForm,
  followUpDate,
  setFollowUpDate,
  followUpTime,
  setFollowUpTime,
  followUpReason,
  setFollowUpReason,
  handleScheduleFollowUp,
}: FollowUpProps) => {
  return (
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
            {followUp.date.toLocaleDateString()} · {followUp.time}
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
        onClick={() =>
          setShowFollowUpForm((previous) => !previous)
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
              onChange={(event) => setFollowUpDate(event.target.value)}
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
              onChange={(event) => setFollowUpTime(event.target.value)}
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
              onChange={(event) => setFollowUpReason(event.target.value)}
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
  );
};