import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import MailClient from "./MailClient";

export default async function MailTaskPage() {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) redirect("/login");

  return <MailClient />;
}
