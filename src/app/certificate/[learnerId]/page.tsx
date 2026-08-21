import { redirect } from "next/navigation";

/** Certificates were replaced by in-game awards. Old links land on the desktop. */
export default function CertificatePage() {
  redirect("/");
}
