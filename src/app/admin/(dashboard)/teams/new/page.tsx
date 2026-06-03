import { PageTitle } from "@/components/admin/page-title";
import { TeamForm } from "../team-form";

export default function NewTeamPage() {
  return (
    <>
      <PageTitle title="Add team" backHref="/admin/teams" />
      <TeamForm />
    </>
  );
}
