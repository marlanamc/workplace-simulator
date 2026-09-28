import { redirect } from "next/navigation";

/**
 * The printable certificate is retired. What a learner keeps now is their
 * summary (`/summary`): first-person skills, name, class code, and date,
 * with copy, download, and print. Old certificate links go there on purpose.
 *
 * The id in the old link is ignored: `/summary` only ever shows the signed-in
 * learner's own work, so a guessed id cannot open someone else's.
 */
export default function CertificatePage() {
  redirect("/summary");
}
