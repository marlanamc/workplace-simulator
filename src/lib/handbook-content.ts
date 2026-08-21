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
      "Call or text your shift lead at least 2 hours before your shift starts.",
      "Say your name, your shift time, and that you won't be able to come in.",
      "If you're sick more than 2 days in a row, you'll need a doctor's note before your next shift.",
    ],
  },
  {
    slug: "breaks",
    title: "Break rules",
    section: "During your shift",
    body: [
      "Shifts of 6 hours or more get one paid 10-minute break and one unpaid 30-minute meal break.",
      "Clock out for your meal break, even if you're eating in the break room.",
      "Breaks can't be skipped to leave earlier. They are required by law.",
    ],
  },
  {
    slug: "dress-code",
    title: "Dress code",
    section: "General",
    body: [
      "Closed-toe shoes at all times. No sandals or open-back shoes.",
      "Your Harborside apron and name tag should be worn during your whole shift.",
      "Hair longer than shoulder length should be tied back near food prep areas.",
    ],
  },
  {
    slug: "who-to-ask",
    title: "Who to ask when you're stuck",
    section: "General",
    body: [
      "Shift questions (schedule, swaps, clocking in/out): ask your shift lead first.",
      "Pay or tax questions: message Harborside HR through the Employee Portal.",
      "Anything about a customer or safety issue: talk to the manager on duty right away.",
    ],
  },
];
