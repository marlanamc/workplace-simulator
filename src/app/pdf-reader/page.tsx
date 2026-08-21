import { redirect } from "next/navigation";

// PDF Reader is now a window opened from the desktop, not a standalone route.
export default function PdfReaderRedirect() {
  redirect("/");
}
