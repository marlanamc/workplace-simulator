import Password from "./password";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const p = await searchParams;
  return (
    <Password
      initialLang={p.lang === "es" ? "es" : "en"}
      initialMode={p.mode === "independent" ? "independent" : "guided"}
      preview={p.preview === "1"}
      transfer={p.transfer === "1"}
    />
  );
}
