import { revalidatePath } from "next/cache";

/** Refresh the public pages that read league data after an admin edit. */
export function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/teams");
  revalidatePath("/schedule");
  revalidatePath("/standings");
  revalidatePath("/stats");
  revalidatePath("/about");
}
