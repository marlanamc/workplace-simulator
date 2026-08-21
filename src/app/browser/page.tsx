import { redirect } from "next/navigation";

// Browser is now a window opened from the desktop, not a standalone route.
export default function BrowserRedirect() {
  redirect("/");
}
