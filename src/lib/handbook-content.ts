export interface HandbookArticle {
  slug: string;
  title: string;
  section: string;
  body: string[];
}

export const HANDBOOK_ARTICLES: HandbookArticle[] = [
  {
    slug: "calling-out",
    title: "Calling out sick",
    section: "Attendance",
    body: [
      "If you are sick and cannot work, call or text your shift lead at least 2 hours before your shift starts.",
      "Tell them your name, what time your shift is, and that you will not be able to come in.",
      "If you are out sick more than 2 days in a row, bring a doctor's note before you come back.",
    ],
  },
  {
    slug: "breaks",
    title: "Break rules",
    section: "During your shift",
    body: [
      "If your shift is 6 hours or longer, you get one paid 10-minute break and one unpaid 30-minute meal break.",
      "Clock out for your meal break, even if you eat in the break room.",
      "You cannot skip a break to leave early. Breaks are required by law.",
    ],
  },
  {
    slug: "dress-code",
    title: "Dress code",
    section: "General",
    body: [
      "Wear closed-toe shoes the whole shift. No sandals or shoes that are open in the back.",
      "Wear your Harborside apron and name tag for the whole shift.",
      "If your hair is longer than your shoulders, tie it back when you are near food.",
    ],
  },
  {
    slug: "who-to-ask",
    title: "Who to ask when you're stuck",
    section: "General",
    body: [
      "Questions about your schedule, a swap, or clocking in and out: ask your shift lead first.",
      "Questions about pay or taxes: message Harborside HR in the Employee Portal.",
      "A customer problem or a safety issue: tell the manager on duty right away.",
    ],
  },
];
