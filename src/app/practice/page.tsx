import Link from "next/link";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const es = (await searchParams).lang === "es";
  const t = (en: string, spanish: string) => (es ? spanish : en);
  return (
    <main className="practice-library" lang={es ? "es" : "en"}>
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
      <section className="activity-list">
        <div>
          <span className="eyebrow">
            {t("EMAIL · ONLINE FORMS", "CORREO · FORMULARIOS")}
          </span>
          <h2>{t("Register for a workshop", "Inscribirse en un taller")}</h2>
          <p>
            {t(
              "Read an invitation, complete a form, and check your confirmation.",
              "Lee una invitación, completa un formulario y revisa la confirmación.",
            )}
          </p>
          <p>
            {t(
              "About 5–10 minutes · No account needed",
              "Aproximadamente 5–10 minutos · Sin cuenta",
            )}
          </p>
        </div>
        <div className="actions">
          <Link
            className="primary"
            href={`/practice/workshop?lang=${es ? "es" : "en"}`}
          >
            {t("Start practice", "Empezar")}
          </Link>
          <Link href={`/practice/workshop?preview=1&lang=${es ? "es" : "en"}`}>
            {t("Teacher preview & sharing", "Vista docente y enlace")}
          </Link>
        </div>
      </section>
      <footer>
        {t(
          "Practice uses fictional details. Nothing is sent to an outside service.",
          "La práctica usa datos ficticios. No se envía nada a un servicio externo.",
        )}
      </footer>
    </main>
  );
}
