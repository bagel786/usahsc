import type { Match, Team } from "@prisma/client";
import { Field, Input, Select, Textarea } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/submit-button";
import { createMatch, updateMatch } from "./actions";

function toLocalInput(date: Date) {
  // Format as YYYY-MM-DDTHH:MM in Central Time for the datetime-local input.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function MatchForm({ teams, match }: { teams: Team[]; match?: Match }) {
  const action = match ? updateMatch : createMatch;

  return (
    <form action={action} className="max-w-2xl space-y-5">
      {match && <input type="hidden" name="id" value={match.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Home team" htmlFor="homeTeamId">
          <Select id="homeTeamId" name="homeTeamId" defaultValue={match?.homeTeamId ?? ""} required>
            <option value="" disabled>
              Select team
            </option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Away team" htmlFor="awayTeamId">
          <Select id="awayTeamId" name="awayTeamId" defaultValue={match?.awayTeamId ?? ""} required>
            <option value="" disabled>
              Select team
            </option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Date & time" htmlFor="dateTime" hint="Central Time (Texas).">
          <Input
            id="dateTime"
            name="dateTime"
            type="datetime-local"
            defaultValue={match ? toLocalInput(match.dateTime) : ""}
            required
          />
        </Field>
        <Field label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={match?.status ?? "upcoming"}>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </Select>
        </Field>
        <Field label="Location" htmlFor="location">
          <Input id="location" name="location" defaultValue={match?.location ?? ""} placeholder="Ground / field" />
        </Field>
        <Field label="Stage" htmlFor="stage">
          <Input id="stage" name="stage" defaultValue={match?.stage ?? ""} placeholder="Group Stage / Semi-Final" />
        </Field>
      </div>

      <div className="rounded-xl border border-line/60 bg-surface-2/30 p-4">
        <p className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-muted">
          Result (for completed matches)
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Home score" htmlFor="homeScore">
            <Input id="homeScore" name="homeScore" defaultValue={match?.homeScore ?? ""} placeholder="168/4 (20)" />
          </Field>
          <Field label="Away score" htmlFor="awayScore">
            <Input id="awayScore" name="awayScore" defaultValue={match?.awayScore ?? ""} placeholder="121/9 (20)" />
          </Field>
        </div>
        <Field label="Result summary" htmlFor="resultText" className="mt-5">
          <Input id="resultText" name="resultText" defaultValue={match?.resultText ?? ""} placeholder="Westlake won by 47 runs" />
        </Field>
        <Field label="CricClubs scorecard URL" htmlFor="scorecardUrl" className="mt-5">
          <Textarea id="scorecardUrl" name="scorecardUrl" defaultValue={match?.scorecardUrl ?? ""} placeholder="https://cricclubs.com/USHSC/viewScorecard..." className="min-h-16" />
        </Field>
      </div>

      <SubmitButton>{match ? "Save match" : "Create match"}</SubmitButton>
    </form>
  );
}
