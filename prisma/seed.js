const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding database...");

  // Delete existing data to avoid conflicts on directUrl/url
  // Clean up order: SavedIdea/Comment/Like -> Idea -> User
  await prisma.savedIdea.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create Users
  const usersData = [
    { name: "Sarah Chen", email: "sarah.chen@example.com", password: hashedPassword },
    { name: "David Miller", email: "david.miller@example.com", password: hashedPassword },
    { name: "Priya Patel", email: "priya.patel@example.com", password: hashedPassword },
    { name: "Marcus Aurelius", email: "marcus@example.com", password: hashedPassword },
    { name: "Aisha Diop", email: "aisha.diop@example.com", password: hashedPassword },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: u,
    });
    createdUsers.push(user);
    console.log(`Created user: ${user.name}`);
  }

  // Create Ideas
  const ideasData = [
    {
      title: "The Feynman Technique for Fast Learning",
      description: "Choose a concept you want to learn. Write it down. Explain it to a 10-year-old child. Identify gaps in your explanation. Go back to the source material to fill those gaps. Simplify your explanation and use analogies. This simple strategy forces deep comprehension.",
      category: "Study Tips",
      tags: ["learning", "study hacks", "education"],
      references: "https://fs.blog/feynman-technique/",
      userId: createdUsers[0].id, // Sarah Chen
    },
    {
      title: "State Management Simplification with Zustand",
      description: "Are you tired of boilerplate Redux code? Try Zustand. It has no providers, uses hooks, is transient (can subscribe without rendering), and is extremely lightweight. Here is a simple example: const useStore = create((set) => ({ bears: 0, increasePopulation: () => set((state) => ({ bears: state.bears + 1 })) }))",
      category: "Coding Concepts",
      tags: ["react", "javascript", "frontend", "zustand"],
      references: "https://github.com/pmndrs/zustand",
      userId: createdUsers[1].id, // David Miller
    },
    {
      title: "Micro-SaaS Ideas for Niche Markets",
      description: "Build tiny tools for specific platforms. Examples: An analytics dashboard for Notion creators, a backup scheduler for Shopify merchants, or an automatic invoice generator for Freelance contractors. Niche audiences are willing to pay for simple software that solves a specific headache.",
      category: "Business Ideas",
      tags: ["saas", "startup", "indiehackers", "business"],
      references: "https://indiehackers.com",
      userId: createdUsers[2].id, // Priya Patel
    },
    {
      title: "The 5-Minute Morning Journaling Routine",
      description: "Write down 3 things you are grateful for, 3 things that would make today great, and 1 daily affirmation. At night, list 3 amazing things that happened and 1 thing you could have done better. This takes less than 5 minutes and drastically improves mindfulness.",
      category: "Life Hacks",
      tags: ["productivity", "mindfulness", "journaling", "life"],
      references: "https://www.intelligentchange.com/blogs/read/the-five-minute-journal-rules",
      userId: createdUsers[3].id, // Marcus Aurelius
    },
    {
      title: "Understanding CSS Grid Autofit vs Autofill",
      description: "Autofill creates grid tracks and fills the row with empty columns if there is space. Autofit collapses any empty tracks to zero width, letting the filled tracks stretch to take up the remaining space. Knowing this distinction is key to creating responsive fluid layouts without media queries.",
      category: "Coding Concepts",
      tags: ["css", "webdesign", "frontend", "layout"],
      references: "https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/",
      userId: createdUsers[4].id, // Aisha Diop
    },
    {
      title: "Active Recall and Spaced Repetition (Anki)",
      description: "Instead of highlighting textbook pages, write questions. Test yourself actively. Use flashcard tools like Anki that schedule cards dynamically based on how well you remember them. Spaced repetition fights the forgetting curve and secures facts in long-term memory.",
      category: "Study Tips",
      tags: ["study tips", "anki", "memorization"],
      references: "https://apps.ankiweb.net/",
      userId: createdUsers[0].id, // Sarah Chen
    },
    {
      title: "B2B Newsletter: Curation of Industry Trends",
      description: "Start a weekly newsletter curating the top news, tools, and tutorials for a specific profession (e.g. UX designers, AI researchers, or product managers). Monetize via high-quality sponsors once you reach 1,000 engaged subscribers. High-intent readers make this very attractive to advertisers.",
      category: "Business Ideas",
      tags: ["marketing", "business", "newsletter", "monetize"],
      references: "https://substack.com",
      userId: createdUsers[2].id, // Priya Patel
    },
    {
      title: "Using the Pomodoro Technique to Prevent Burnout",
      description: "Work for 25 minutes, then rest for 5 minutes. Every 4 cycles, take a longer 15-30 minute break. During breaks, stretch, drink water, or look away from the screen. This cyclical focus pattern keeps your brain fresh and prevents mid-day exhaustion.",
      category: "Life Hacks",
      tags: ["pomodoro", "focus", "burnout", "productivity"],
      references: "https://francescocirillo.com/products/the-pomodoro-technique",
      userId: createdUsers[3].id, // Marcus Aurelius
    },
    {
      title: "Building Type-Safe APIs with Node & Prisma",
      description: "Prisma is a next-generation ORM that makes working with databases intuitive. Combining it with Express.js allows you to quickly structure type-safe backend systems. Define your models, run migrations, and write clean async controller code to query database collections seamlessly.",
      category: "Coding Concepts",
      tags: ["node", "express", "prisma", "database"],
      references: "https://www.prisma.io/",
      userId: createdUsers[1].id, // David Miller
    },
    {
      title: "The Cornell Note-Taking System",
      description: "Divide your paper into three sections: Cue Column (left), Notes (right), and Summary (bottom). During class, take notes on the right. After class, write keywords or questions on the left. Finally, summarize the entire page in 3-4 sentences at the bottom. Great for active revision.",
      category: "Study Tips",
      tags: ["notes", "cornell", "education", "study hacks"],
      references: "https://lsc.cornell.edu/how-to-study/taking-notes/cornell-note-taking-system/",
      userId: createdUsers[4].id, // Aisha Diop
    },
  ];

  for (const idea of ideasData) {
    const createdIdea = await prisma.idea.create({
      data: idea,
    });
    console.log(`Created idea: ${createdIdea.title}`);
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
