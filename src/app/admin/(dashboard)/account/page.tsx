import { requireAdmin } from "@/lib/auth-guard";
import { PageTitle } from "@/components/admin/page-title";
import { AccountForm } from "./account-form";

export default async function AccountPage() {
  const user = await requireAdmin();
  return (
    <>
      <PageTitle title="Account" subtitle={`Signed in as ${user.email}`} />
      <AccountForm />
    </>
  );
}
