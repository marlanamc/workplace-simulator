import Link from "next/link";
import { ACTIVITIES } from "@/lib/practice/activities";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const es = (await searchParams).lang === "es";
  const lang = es ? "es" : "en";
  const t = (en: string, spanish: string) => (es ? spanish : en);
  return (
    <main className="practice-library" lang={lang}>
      <header>
        <strong>Digital Practice</strong>
        <Link href={es ? "/practice" : "/practice?lang=es"}>
          {es ? "English" : "Español"}
        </Link>
      </header>
      <p className="eyebrow">
        {t("EVERYDAY DIGITAL SKILLS", "HABILIDADES DIGITALES COTIDIANAS")}
      </p>
      <h1>
        {t(
          "A little practice. More independence.",
          "Un poco de práctica. Más independencia.",
        )}
      </h1>
      <p>
        {t(
          "Practice a real-world task, with help whenever you need it.",
          "Practica una tarea cotidiana, con ayuda cuando la necesites.",
        )}
      </p>
      {ACTIVITIES.map((a) => (
        <section className="activity-list" key={a.id}>
          <div>
            <span className="eyebrow">{a.eyebrow[lang]}</span>
            <h2>{a.title[lang]}</h2>
            <p>{a.summary[lang]}</p>
            <p>{a.minutes[lang]}</p>
          </div>
          <div className="actions">
            <Link
              className="primary"
              href={`/practice/${a.id}?lang=${lang}`}
              aria-label={`${t("Start practice", "Empezar")}: ${a.title[lang]}`}
            >
              {t("Start practice", "Empezar")}
            </Link>
            <Link
              href={`/practice/${a.id}?preview=1&lang=${lang}`}
              aria-label={`${t("Teacher preview & guide", "Vista docente y guía")}: ${a.title[lang]}`}
            >
              {t("Teacher preview & guide", "Vista docente y guía")}
            </Link>
          </div>
        </section>
      ))}
      <footer>
        {t(
          "Practice uses fictional details. Nothing is sent to an outside service.",
          "La práctica usa datos ficticios. No se envía nada a un servicio externo.",
        )}
      </footer>
    </main>
  );
}
