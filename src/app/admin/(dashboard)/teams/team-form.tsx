import type { Team } from "@prisma/client";
import { Field, Input, Textarea, Checkbox } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/submit-button";
import { TeamLogo } from "@/components/site/team-logo";
import { createTeam, updateTeam } from "./actions";

export function TeamForm({ team }: { team?: Team }) {
  const action = team ? updateTeam : createTeam;

  return (
    <form action={action} className="max-w-2xl space-y-5">
      {team && <input type="hidden" name="id" value={team.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Team name" htmlFor="name">
          <Input id="name" name="name" defaultValue={team?.name} required placeholder="Westlake" />
        </Field>
        <Field label="School" htmlFor="school">
          <Input id="school" name="school" defaultValue={team?.school} required placeholder="Westlake High School" />
        </Field>
        <Field label="Mascot" htmlFor="mascot">
          <Input id="mascot" name="mascot" defaultValue={team?.mascot ?? ""} placeholder="Chaparrals" />
        </Field>
        <Field label="Captain" htmlFor="captain">
          <Input id="captain" name="captain" defaultValue={team?.captain ?? ""} placeholder="Full name" />
        </Field>
        <Field label="URL slug" htmlFor="slug" hint="Leave blank to auto-generate from the name.">
          <Input id="slug" name="slug" defaultValue={team?.slug ?? ""} placeholder="westlake" />
        </Field>
        <Field label="Display order" htmlFor="displayOrder" hint="Lower numbers appear first.">
          <Input id="displayOrder" name="displayOrder" type="number" defaultValue={team?.displayOrder ?? 0} />
        </Field>
        <Field label="CricClubs URL" htmlFor="cricclubsUrl">
          <Input id="cricclubsUrl" name="cricclubsUrl" type="url" defaultValue={team?.cricclubsUrl ?? ""} placeholder="https://cricclubs.com/..." />
        </Field>
        <Field label="Instagram URL" htmlFor="instagramUrl">
          <Input id="instagramUrl" name="instagramUrl" type="url" defaultValue={team?.instagramUrl ?? ""} placeholder="https://instagram.com/..." />
        </Field>
      </div>

      <Field label="Team color" htmlFor="primaryColor" hint="Used for the logo fallback badge and accents.">
        <input
          id="primaryColor"
          name="primaryColor"
          type="color"
          defaultValue={team?.primaryColor ?? "#e11d2a"}
          className="h-11 w-20 cursor-pointer rounded-lg border border-line bg-surface"
        />
      </Field>

      <Field label="About / bio" htmlFor="bio">
        <Textarea id="bio" name="bio" defaultValue={team?.bio ?? ""} placeholder="Short description shown on the team page." />
      </Field>

      <Field
        label="Team logo"
        htmlFor="logo"
        hint="PNG, JPG, WEBP or SVG (max 3 MB). Leave empty to keep the current logo."
      >
        <div className="flex items-center gap-4">
          {team && (
            <TeamLogo name={team.name} logoUrl={team.logoUrl} color={team.primaryColor} size={56} />
          )}
          <Input id="logo" name="logo" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" />
        </div>
      </Field>

      <Checkbox label="Active (show on the public site)" name="isActive" defaultChecked={team ? team.isActive : true} />

      <div className="flex gap-3 pt-2">
        <SubmitButton>{team ? "Save changes" : "Create team"}</SubmitButton>
      </div>
    </form>
  );
}
