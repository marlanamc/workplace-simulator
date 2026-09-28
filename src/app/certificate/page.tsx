import { redirect } from "next/navigation";

/** The retired certificate's address. It leads to the learner's summary. */
export default function CertificateIndexPage() {
  redirect("/summary");
}
