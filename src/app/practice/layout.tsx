import { Atkinson_Hyperlegible } from "next/font/google";
import "./practice.css";
const font = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
});
export const metadata = {
  title: "Digital Practice",
  description: "Short, supported practice for everyday computer tasks.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`practice ${font.className}`}>{children}</div>;
}
