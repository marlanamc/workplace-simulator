import { redirect } from "next/navigation";

// The email task now lives inside the Browser app as a tab.
export default function MailRedirect() {
  redirect("/browser?tab=mail");
}
