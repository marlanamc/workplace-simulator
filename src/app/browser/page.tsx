import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import { getLearnerById } from "@/lib/db/queries";
import BrowserClient from "./BrowserClient";

export default async function BrowserPage() {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) redirect("/login");

  const learner = await getLearnerById(learnerId);
  if (!learner) redirect("/login");

  return (
    <Suspense>
      <BrowserClient displayName={learner.displayName} />
    </Suspense>
  );
}
