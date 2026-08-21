import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import { getLearnerById } from "@/lib/db/queries";
import PdfReaderClient from "./PdfReaderClient";

export default async function PdfReaderPage() {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) redirect("/login");

  const learner = await getLearnerById(learnerId);
  if (!learner) redirect("/login");

  return <PdfReaderClient displayName={learner.displayName} />;
}
