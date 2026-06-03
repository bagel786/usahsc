import { PageTitle } from "@/components/admin/page-title";
import { getSettings } from "@/lib/content";
import { ContentForm } from "./content-form";

export default async function AdminContentPage() {
  const settings = await getSettings();
  return (
    <>
      <PageTitle
        title="Site Content"
        subtitle="Edit the text shown across the public site. Changes go live on save."
      />
      <ContentForm settings={settings} />
    </>
  );
}
