import { redirect } from "next/navigation";

// The email task now lives inside the Browser window as a tab.
export default function MailRedirect() {
  redirect("/");
}
