import "./practice.css";
export const metadata = {
  title: "Digital Practice",
  description: "Short, supported practice for everyday computer tasks.",
};
/** Uses the app-wide Roboto (root layout) so practice feels like the Google tools students use. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="practice">{children}</div>;
}
