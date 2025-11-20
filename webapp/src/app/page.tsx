import { clsx } from "clsx";
import { format } from "date-fns";
import {
  createAssociate,
  createAutomation,
  createTemplate,
  deleteAutomation,
  getDashboardData,
  runScheduler,
} from "@/lib/actions";
import type {
  DashboardAutomation,
  DashboardRun,
  DashboardAssociate,
  DashboardTemplate,
} from "@/lib/actions";
import { TIMEZONES } from "@/lib/timezones";
import { CalendarDays, Clock, Play, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

const WEEKDAYS = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

export default async function Page() {
  const {
    associates,
    templates,
    automations,
    runs,
  }: {
    associates: DashboardAssociate[];
    templates: DashboardTemplate[];
    automations: DashboardAutomation[];
    runs: DashboardRun[];
  } = await getDashboardData();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-12 md:px-10">
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="pill w-fit bg-sky-500/10 text-sky-200">
            Automation Studio
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Coordinate every associate from a single mission control
          </h1>
          <p className="max-w-3xl text-base text-slate-300 md:text-lg">
            OrbitOps orchestrates scheduled work packages, keeps every teammate
            aligned across timezones, and gives operations leads a real-time
            cockpit to launch, monitor, and replay task drops.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="pill border-sky-500/40 bg-sky-500/10 text-slate-200">
            {associates.length} associates ready
          </div>
          <div className="pill border-emerald-500/40 bg-emerald-500/10 text-slate-200">
            {templates.length} work templates
          </div>
          <div className="pill border-indigo-500/40 bg-indigo-500/10 text-slate-200">
            {automations.length} active automations
          </div>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <article className="card">
          <h2 className="card-title">Add associate</h2>
          <p className="mt-2 text-sm text-slate-300">
            Enroll a teammate with their preferred timezone and role context.
          </p>
          <form action={createAssociate} className="mt-5 flex flex-col gap-4">
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Name
              </label>
              <input name="name" required placeholder="Jane Operator" />
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="jane@team.com"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Timezone
              </label>
              <select name="timezone" defaultValue="UTC" required>
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Role / pod
              </label>
              <input name="role" placeholder="Fulfillment pod" />
            </div>
            <div className="flex justify-end">
              <button type="submit">Save associate</button>
            </div>
          </form>
        </article>

        <article className="card">
          <h2 className="card-title">Design work template</h2>
          <p className="mt-2 text-sm text-slate-300">
            Capture the repeatable playbook with subject, body, tasks, and
            supporting links.
          </p>
          <form action={createTemplate} className="mt-5 flex flex-col gap-4">
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Title
              </label>
              <input name="title" required placeholder="Daily queue review" />
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Subject line
              </label>
              <input
                name="subject"
                required
                placeholder="📬 Queue oversight – {date}"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Headline (optional)
              </label>
              <input name="headline" placeholder="Inbound queue sweep" />
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Summary (optional)
              </label>
              <input
                name="summary"
                placeholder="Morning queue audit across all markets"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Body copy (optional)
              </label>
              <textarea
                name="body"
                rows={3}
                placeholder="Run the daily queue review and flag blockers."
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Task bullets
              </label>
              <textarea
                name="tasks"
                rows={3}
                placeholder={"Task title :: optional detail"}
              />
              <p className="text-[11px] text-slate-400">
                One per line. Add{" "}
                <span className="font-semibold text-slate-200">::</span> to
                append extra guidance.
              </p>
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Helpful links
              </label>
              <textarea
                name="links"
                rows={2}
                placeholder="Runbook | https://docs.yourteam.com/runbook"
              />
              <p className="text-[11px] text-slate-400">
                Format: label <span className="font-semibold text-slate-200">
                  |
                </span>{" "}
                URL
              </p>
            </div>
            <div className="flex justify-end">
              <button type="submit">Save template</button>
            </div>
          </form>
        </article>

        <article className="card xl:row-span-2">
          <h2 className="card-title">Schedule automation</h2>
          <p className="mt-2 text-sm text-slate-300">
            Select your associates, plug in a template, and OrbitOps will take
            it from here.
          </p>
          <form action={createAutomation} className="mt-5 flex flex-col gap-4">
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Automation name
              </label>
              <input
                name="name"
                required
                placeholder="Americas daily kickoff"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Template
              </label>
              <select name="templateId" required defaultValue="">
                <option value="" disabled>
                  Choose template
                </option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Associates
              </label>
              <select
                name="associateIds"
                multiple
                required
                className="min-h-[120px]"
              >
                {associates.map((associate) => (
                  <option key={associate.id} value={associate.id}>
                    {associate.name} — {associate.email}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                Hold <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> to select multiple.
              </p>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Frequency
                </label>
                <select name="frequency" defaultValue="daily">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly cadence</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Send time
                </label>
                <input type="time" name="sendTime" required defaultValue="09:00" />
              </div>
            </div>

            <div className="grid gap-3">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Weekly cadence days
              </span>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day) => (
                  <label
                    key={day.value}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-xs text-slate-200"
                  >
                    <input
                      type="checkbox"
                      name="weeklyDays"
                      value={day.value}
                      className="h-3 w-3 accent-sky-500"
                    />
                    {day.label}
                  </label>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                Leave empty for daily runs or select multiple weekdays.
              </p>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Start date
                </label>
                <input type="date" name="startDate" />
              </div>
              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  End date
                </label>
                <input type="date" name="endDate" />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Automation timezone
              </label>
              <select name="timezone" required defaultValue="UTC">
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button type="submit">Activate automation</button>
            </div>
          </form>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <article className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title">Live automations</h2>
              <p className="mt-2 text-sm text-slate-300">
                Track every cadence, who is assigned, and the next drop window.
              </p>
            </div>
            <form action={runScheduler}>
              <button type="submit" className="gap-2">
                <Play size={14} />
                Sync now
              </button>
            </form>
          </div>
          <div className="mt-6 grid gap-4">
            {automations.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-700/70 bg-slate-900/40 p-6 text-sm text-slate-400">
                No automations yet. Create one to start sending scheduled work.
              </p>
            )}
            {automations.map((automation) => {
              const nextRun = automation.next_run_at
                ? format(new Date(automation.next_run_at), "PPpp")
                : "—";
              const lastRun = automation.last_run_at
                ? format(new Date(automation.last_run_at), "PPpp")
                : "—";
              return (
                <div
                  key={automation.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {automation.name}
                      </h3>
                      <p className="text-sm text-slate-400">
                        Template: {automation.template_title}
                      </p>
                    </div>
                    <form action={deleteAutomation}>
                      <input
                        type="hidden"
                        name="automationId"
                        value={automation.id}
                      />
                      <button
                        type="submit"
                        className="bg-red-500/20 text-red-200 hover:bg-red-500/30"
                      >
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
                    <span className="pill bg-indigo-500/10 text-indigo-200">
                      {automation.frequency === "daily"
                        ? "Daily"
                        : `Weekly · ${
                            automation.weekly_days?.join(", ") ?? "custom"
                          }`}
                    </span>
                    <span className="pill bg-slate-800/60">
                      <Clock size={12} className="mr-2" />
                      {automation.send_time} ({automation.timezone})
                    </span>
                    {automation.start_date && (
                      <span className="pill bg-slate-800/60">
                        Starts {automation.start_date}
                      </span>
                    )}
                    {automation.end_date && (
                      <span className="pill bg-slate-800/60">
                        Ends {automation.end_date}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col gap-1 text-sm text-slate-300">
                    <span className="flex items-center gap-2 text-slate-200">
                      <CalendarDays size={14} />
                      Next run: {nextRun}
                    </span>
                    <span className="flex items-center gap-2 text-slate-400">
                      <Clock size={14} />
                      Last run: {lastRun}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {automation.associates.map((associate) => (
                      <span key={associate.id} className="pill">
                        {associate.name} · {associate.email}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <aside className="card space-y-5">
          <h2 className="card-title">Run log</h2>
          <p className="text-sm text-slate-300">
            Every time an automation fires, OrbitOps records the drop.
          </p>
          <div className="space-y-3">
            {runs.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-700/70 bg-slate-900/40 p-5 text-sm text-slate-400">
                Runs will appear here once automations execute.
              </p>
            )}
            {runs.map((run) => (
              <div
                key={run.id}
                className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
              >
                <p className="text-sm font-medium text-white">
                  {run.automation_name}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Scheduled {format(new Date(run.scheduled_for), "PPpp")}
                </p>
                <p
                  className={clsx(
                    "mt-2 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium",
                    run.status === "sent"
                      ? "bg-emerald-500/15 text-emerald-200"
                      : "bg-amber-500/15 text-amber-200",
                  )}
                >
                  {run.status.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
