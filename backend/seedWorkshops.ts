import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/workshopdb";

// 1. Increased Master Pool to support 24 workshops
const allUsers = Array.from({ length: 250 }, () => ({
  _id: new ObjectId(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  profilePicture: faker.image.avatar(),
}));

// Reserve 8 users to be Hosts
const hosts = allUsers.slice(0, 8);
// The rest are attendees
const attendeePool = allUsers.slice(8);

const reviewComments = [
  "Absolutely loved this workshop and learned a lot throughout the session. The instructor explained everything clearly and made the experience enjoyable from start to finish.",
  "The instructor was very knowledgeable and kept the workshop engaging the entire time. I appreciated how they answered questions with real-world examples and practical advice.",
  "The content was useful and easy to follow for most of the workshop. The ending felt a little rushed, but overall it was still a valuable learning experience.",
  "I would definitely attend another workshop like this in the future. The atmosphere was welcoming, and the information shared was genuinely helpful and well presented.",
  "Everything was very well organized from the beginning to the end. The material was explained clearly, and the pacing made it easy to stay focused and understand the concepts.",
  "This workshop exceeded my expectations in both quality and presentation. I felt that the value provided easily justified the cost and time spent attending.",
  "I learned several practical skills that I can immediately apply to my own projects. The hands-on examples made the lessons much easier to understand and remember.",
  "The overall experience was amazing and very enjoyable throughout the session. I also had the chance to meet interesting people and connect with others who shared similar interests.",
  "The workshop was a bit too basic for my current skill level, but it would be excellent for beginners. The explanations were clear and beginner-friendly, making it approachable for new learners.",
  "The host was extremely helpful and patient during the Q&A section. They took the time to answer questions thoroughly and made everyone feel comfortable participating.",
];

// Helper: Generates MATCHING attendees and reviews (with 1-5 star variance)
const generateAttendeesAndReviews = (count: number) => {
  const shuffled = [...attendeePool].sort(() => 0.5 - Math.random());
  const selectedUsers = shuffled.slice(0, count);

  const attendees = selectedUsers.map((user) => user._id);

  const reviews = selectedUsers.map((user) => ({
    user: user._id,
    name: user.name,
    comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
    rating: Math.floor(Math.random() * 5) + 1, // Fix: Ratings from 1 to 5
    createdAt: new Date(),
  }));

  return { attendees, reviews };
};

// Workshop records (6 per categories: Design, UI/UX, Marketing, Coding)
const workshops = [
  // 🎨 DESIGN CATEGORY
  {
    _id: new ObjectId(),
    name: "Design Fundamentals Workshop",
    categories: ["Design"],
    date: "June 5, 2026",
    time: "10:00AM – 12:00PM",
    location: "123 Granville St, Vancouver",
    ticketPrice: "$45",
    seats: "40",
    applicationPeriod: "May 1, 2026 – May 30, 2026",
    about:
      "A hands-on introduction to design principles including typography, colour theory, and layout.",
    imageUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[0]._id,
    ...generateAttendeesAndReviews(38), // Almost full
  },
  {
    _id: new ObjectId(),
    name: "Mastering Color Theory",
    categories: ["Design"],
    date: "June 15, 2026",
    time: "1:00PM – 4:00PM",
    location: "Online (Zoom)",
    ticketPrice: "$30",
    seats: "100",
    applicationPeriod: "May 10, 2026 – June 10, 2026",
    about:
      "Dive deep into color psychology, creating accessible palettes, and building brand systems.",
    imageUrl:
      "https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[1]._id,
    ...generateAttendeesAndReviews(45),
  },
  {
    _id: new ObjectId(),
    name: "Logo & Brand Identity Creation",
    categories: ["Design"],
    date: "July 2, 2026",
    time: "9:00AM – 3:00PM",
    location: "456 Robson St, Vancouver",
    ticketPrice: "$120",
    seats: "25",
    applicationPeriod: "June 1, 2026 – June 28, 2026",
    about:
      "Learn the end-to-process of designing a modern logo and comprehensive brand guidelines.",
    imageUrl:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[2]._id,
    ...generateAttendeesAndReviews(25), // Sold out = closed
  },
  {
    _id: new ObjectId(),
    name: "Typography for the Web",
    categories: ["Design"],
    date: "July 18, 2026",
    time: "10:00AM – 12:30PM",
    location: "88 Pacific Blvd, Vancouver",
    ticketPrice: "$40",
    seats: "30",
    applicationPeriod: "June 15, 2026 – July 10, 2026",
    about:
      "Stop using default fonts. Learn how to pair typefaces, establish hierarchy, and improve readability.",
    imageUrl:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[0]._id,
    ...generateAttendeesAndReviews(12),
  },
  {
    _id: new ObjectId(),
    name: "Digital Illustration Basics",
    categories: ["Design"],
    date: "August 5, 2026",
    time: "2:00PM – 5:00PM",
    location: "Gastown Art Hub, Vancouver",
    ticketPrice: "$65",
    seats: "20",
    applicationPeriod: "July 1, 2026 – August 1, 2026",
    about:
      "Bring your iPad! We'll cover Procreate basics, sketching, and finalizing digital illustrations.",
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[3]._id,
    ...generateAttendeesAndReviews(18),
  },
  {
    _id: new ObjectId(),
    name: "Packaging Design Workshop",
    categories: ["Design"],
    date: "August 20, 2026",
    time: "10:00AM – 4:00PM",
    location: "33 W 8th Ave, Vancouver",
    ticketPrice: "$90",
    seats: "15",
    applicationPeriod: "July 20, 2026 – August 15, 2026",
    about:
      "Learn dielines, print constraints, and how to make products stand out on physical retail shelves.",
    imageUrl:
      "https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[4]._id,
    ...generateAttendeesAndReviews(8),
  },

  // 🖱️ UI/UX CATEGORY
  {
    _id: new ObjectId(),
    name: "UI/UX Design Sprint",
    categories: ["UI/UX"],
    date: "July 3, 2026",
    time: "10:00AM – 4:00PM",
    location: "555 Seymour St, Vancouver",
    ticketPrice: "$90",
    seats: "20",
    applicationPeriod: "June 1, 2026 – June 25, 2026",
    about:
      "A full-day intensive workshop where you will go from problem definition to a tested prototype.",
    imageUrl:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[1]._id,
    ...generateAttendeesAndReviews(16),
  },
  {
    _id: new ObjectId(),
    name: "Figma Component Architecture",
    categories: ["UI/UX"],
    date: "July 10, 2026",
    time: "1:00PM – 4:00PM",
    location: "Online (Discord)",
    ticketPrice: "$50",
    seats: "50",
    applicationPeriod: "June 15, 2026 – July 5, 2026",
    about: "Master variables, auto-layout, and building scalable component libraries in Figma.",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[5]._id,
    ...generateAttendeesAndReviews(48), // Closing soon
  },
  {
    _id: new ObjectId(),
    name: "UX Research Methods",
    categories: ["UI/UX"],
    date: "July 22, 2026",
    time: "9:00AM – 1:00PM",
    location: "Burnaby Tech Hub",
    ticketPrice: "$75",
    seats: "30",
    applicationPeriod: "June 20, 2026 – July 18, 2026",
    about:
      "Learn how to conduct user interviews, card sorting, and usability testing to validate your designs.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[2]._id,
    ...generateAttendeesAndReviews(15),
  },
  {
    _id: new ObjectId(),
    name: "Accessibility in UI Design (WCAG)",
    categories: ["UI/UX"],
    date: "August 1, 2026",
    time: "10:00AM – 12:00PM",
    location: "Online (Zoom)",
    ticketPrice: "Free",
    seats: "200",
    applicationPeriod: "July 1, 2026 – July 30, 2026",
    about:
      "Ensure your apps are usable by everyone. A deep dive into contrast ratios, screen readers, and WCAG AAA compliance.",
    imageUrl:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[6]._id,
    ...generateAttendeesAndReviews(150),
  },
  {
    _id: new ObjectId(),
    name: "Advanced Prototyping",
    categories: ["UI/UX"],
    date: "August 15, 2026",
    time: "2:00PM – 5:00PM",
    location: "150 W Hastings St, Vancouver",
    ticketPrice: "$80",
    seats: "25",
    applicationPeriod: "July 15, 2026 – August 10, 2026",
    about:
      "Take your static screens to the next level with advanced micro-interactions and scroll-triggered animations.",
    imageUrl:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[1]._id,
    ...generateAttendeesAndReviews(25), // Sold out = closed
  },
  {
    _id: new ObjectId(),
    name: "Designing for Mobile Apps",
    categories: ["UI/UX"],
    date: "September 5, 2026",
    time: "10:00AM – 3:00PM",
    location: "Downtown Vancouver Workspace",
    ticketPrice: "$110",
    seats: "20",
    applicationPeriod: "August 1, 2026 – September 1, 2026",
    about:
      "Understand iOS Human Interface Guidelines and Material Design to build native-feeling mobile apps.",
    imageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[5]._id,
    ...generateAttendeesAndReviews(10),
  },

  // 📈 MARKETING CATEGORY
  {
    _id: new ObjectId(),
    name: "Marketing Strategy Masterclass",
    categories: ["Marketing"],
    date: "June 12, 2026",
    time: "1:00PM – 3:30PM",
    location: "456 Robson St, Vancouver",
    ticketPrice: "$60",
    seats: "35",
    applicationPeriod: "May 10, 2026 – June 5, 2026",
    about:
      "Dive deep into modern marketing strategies including social media, content marketing, and data-driven campaigns.",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[3]._id,
    ...generateAttendeesAndReviews(33), // Closing soon
  },
  {
    _id: new ObjectId(),
    name: "Social Media Growth Hacks",
    categories: ["Marketing"],
    date: "June 20, 2026",
    time: "10:00AM – 12:00PM",
    location: "200 Burrard St, Vancouver",
    ticketPrice: "$40",
    seats: "50",
    applicationPeriod: "May 20, 2026 – June 13, 2026",
    about:
      "Learn proven tactics for growing an audience on Instagram, TikTok, and LinkedIn. Includes real case studies.",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[4]._id,
    ...generateAttendeesAndReviews(22),
  },
  {
    _id: new ObjectId(),
    name: "Email Marketing That Converts",
    categories: ["Marketing"],
    date: "July 8, 2026",
    time: "2:00PM – 4:00PM",
    location: "300 Granville St, Vancouver",
    ticketPrice: "$50",
    seats: "40",
    applicationPeriod: "June 10, 2026 – July 1, 2026",
    about:
      "Build and segment email lists, write subject lines that get opened, and set up automated drip sequences.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[3]._id,
    ...generateAttendeesAndReviews(15),
  },
  {
    _id: new ObjectId(),
    name: "SEO Fundamentals for Startups",
    categories: ["Marketing"],
    date: "July 25, 2026",
    time: "10:00AM – 1:00PM",
    location: "Online (Zoom)",
    ticketPrice: "$45",
    seats: "80",
    applicationPeriod: "June 25, 2026 – July 20, 2026",
    about:
      "Understand keywords, backlink strategies, and on-page optimization to get your app ranking on Google.",
    imageUrl:
      "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[7]._id,
    ...generateAttendeesAndReviews(75), // Closing soon
  },
  {
    _id: new ObjectId(),
    name: "Paid Ads Bootcamp (Google & Meta)",
    categories: ["Marketing"],
    date: "August 12, 2026",
    time: "9:00AM – 3:00PM",
    location: "Gastown Innovation Lab",
    ticketPrice: "$150",
    seats: "25",
    applicationPeriod: "July 12, 2026 – August 5, 2026",
    about:
      "Stop burning money on ads. Learn how to target audiences, write copy, and manage PPC budgets efficiently.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[4]._id,
    ...generateAttendeesAndReviews(25), // Sold out = sold
  },
  {
    _id: new ObjectId(),
    name: "Content Marketing & Storytelling",
    categories: ["Marketing"],
    date: "August 28, 2026",
    time: "1:00PM – 4:00PM",
    location: "Vancouver Public Library",
    ticketPrice: "$35",
    seats: "40",
    applicationPeriod: "July 28, 2026 – August 20, 2026",
    about:
      "Learn how to write blogs, newsletters, and video scripts that engage users and build long-term brand loyalty.",
    imageUrl:
      "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[3]._id,
    ...generateAttendeesAndReviews(18),
  },

  // 💻 CODING CATEGORY
  {
    _id: new ObjectId(),
    name: "Intro to Web Development",
    categories: ["Coding"],
    date: "June 18, 2026",
    time: "9:00AM – 12:00PM",
    location: "789 Burrard St, Vancouver",
    ticketPrice: "$55",
    seats: "100",
    applicationPeriod: "May 15, 2026 – June 10, 2026",
    about: "Learn the basics of HTML, CSS, and JavaScript in this beginner-friendly workshop.",
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[5]._id,
    ...generateAttendeesAndReviews(85),
  },
  {
    _id: new ObjectId(),
    name: "Advanced React Patterns",
    categories: ["Coding"],
    date: "June 25, 2026",
    time: "2:00PM – 5:00PM",
    location: "321 West Georgia St, Vancouver",
    ticketPrice: "$75",
    seats: "25",
    applicationPeriod: "May 20, 2026 – June 18, 2026",
    about:
      "For developers already familiar with React. Covers compound components, custom hooks, and performance optimization.",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[6]._id,
    ...generateAttendeesAndReviews(25), // Sold out = closed
  },
  {
    _id: new ObjectId(),
    name: "API Design with Node & Express",
    categories: ["Coding"],
    date: "July 12, 2026",
    time: "10:00AM – 2:00PM",
    location: "Online (Discord)",
    ticketPrice: "$60",
    seats: "50",
    applicationPeriod: "June 12, 2026 – July 8, 2026",
    about: "Learn RESTful principles, middleware, JWT authentication, and connecting to MongoDB.",
    imageUrl:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[5]._id,
    ...generateAttendeesAndReviews(30),
  },
  {
    _id: new ObjectId(),
    name: "Python for Data Analysis",
    categories: ["Coding"],
    date: "July 15, 2026",
    time: "10:00AM – 1:00PM",
    location: "600 Hastings St, Vancouver",
    ticketPrice: "$65",
    seats: "30",
    applicationPeriod: "June 20, 2026 – July 8, 2026",
    about: "Use pandas, NumPy, and Matplotlib to clean, analyse, and visualise real datasets.",
    imageUrl:
      "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[7]._id,
    ...generateAttendeesAndReviews(29), // Closing soon
  },
  {
    _id: new ObjectId(),
    name: "Full-Stack Next.js App Router",
    categories: ["Coding"],
    date: "August 8, 2026",
    time: "9:00AM – 4:00PM",
    location: "Burnaby Tech Hub",
    ticketPrice: "$120",
    seats: "20",
    applicationPeriod: "July 8, 2026 – August 1, 2026",
    about:
      "A deep dive into Server Components, Server Actions, routing, and deployment with Vercel.",
    imageUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[6]._id,
    ...generateAttendeesAndReviews(14),
  },
  {
    _id: new ObjectId(),
    name: "Cloud Deployment & Docker",
    categories: ["Coding"],
    date: "August 22, 2026",
    time: "1:00PM – 5:00PM",
    location: "Online (Zoom)",
    ticketPrice: "$85",
    seats: "40",
    applicationPeriod: "July 22, 2026 – August 18, 2026",
    about:
      "Stop saying 'it works on my machine.' Containerize your apps and deploy them securely to AWS.",
    imageUrl:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=80",
    hostedBy: hosts[7]._id,
    ...generateAttendeesAndReviews(12),
  },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    const db = client.db();

    // 1. Insert Users
    const usersCol = db.collection("users");
    await usersCol.deleteMany({});
    await usersCol.insertMany(allUsers);
    console.log(`✅ Inserted ${allUsers.length} users (hosts & attendees)`);

    // 2. Insert Workshops
    const workshopsCol = db.collection("workshops");
    await workshopsCol.deleteMany({});
    await workshopsCol.insertMany(workshops);
    console.log(`✅ Inserted ${workshops.length} workshops across 4 categories!`);

    console.log("\n🎉 Seed complete! Collections populated: users, workshops");
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seed();
