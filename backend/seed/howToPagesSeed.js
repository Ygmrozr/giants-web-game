import mongoose from "mongoose";
import dotenv from "dotenv";
import HowToPage from "../models/HowToPage.js";

dotenv.config();

const howToPages = [
  {
    pageNumber: 1,
    leftKicker: "Scout Manual",
    leftTitle: "Mission Basics",
    leftImage: "/images/howto-book-1.png",
    leftText: "Your goal is to clear sectors, defeat Titans, collect Scout Medallions, and survive each mission.",
    leftTip: "Do not rush into Titans from the front. Positioning is the key to survival.",

    kicker: "Page 1",
    title: "Movement & Controls",
    image: "/images/howto-book-2.png",
    bodyType: "list",
    bodyItems: [
      "A / D or Arrow Keys: Move left and right.",
      "W or Up Arrow: Jump.",
      "Space: Attack with your blade.",
      "Mouse Click: Use ODM grapple.",
      "E: Carry civilian in rescue sectors.",
      "G: Drop carried civilian.",
      "R: Restart the current sector."
    ]
  },
  {
    pageNumber: 2,
    leftKicker: "Combat Note",
    leftTitle: "Titan Combat",
    leftImage: "/images/howto-book-3.png",
    leftText: "Titans can be damaged from different body parts, but the final kill must be made from the nape.",
    leftTip: "Attack from behind when the Titan is stunned or distracted.",

    kicker: "Page 2",
    title: "How to Defeat Titans",
    image: "/images/howto-book-4.png",
    bodyType: "list",
    bodyItems: [
      "Normal hits reduce Titan health.",
      "The nape is the weak point.",
      "A Titan only dies when the final hit lands on the nape.",
      "Attacking from the front is dangerous.",
      "Boss Titans have more health and special attack patterns."
    ]
  },
  {
    pageNumber: 3,
    leftKicker: "Gear Guide",
    leftTitle: "Items & Resources",
    leftImage: "/images/howto-book-5.png",
    leftText: "During missions, collect supplies to survive longer and improve your final result.",
    leftTip: "Scout Medallions are important for rewards, market items, and leaderboard power.",

    kicker: "Page 3",
    title: "Supplies",
    image: "/images/howto-book-6.png",
    bodyType: "list",
    bodyItems: [
      "Scout Medallions: Collectible currency used for rewards and progression.",
      "Gas Tank: Restores ODM gas.",
      "Medkit: Restores health.",
      "Boost Item: Temporarily improves attack power.",
      "Collecting more items improves your mission result."
    ]
  },
  {
    pageNumber: 4,
    leftKicker: "Mission Report",
    leftTitle: "Ranks & Progression",
    leftImage: "/images/howto-book-7.png",
    leftText: "After completing a sector, your performance is graded. Better performance gives better results.",
    leftTip: "To earn the best rank, defeat all Titans and collect all available items.",

    kicker: "Page 4",
    title: "Sector Results",
    image: "/images/howto-book-8.png",
    bodyType: "list",
    bodyItems: [
      "Your rank depends on score, Titan kills, medals, and combo.",
      "S and S+ ranks require strong performance.",
      "Completed sectors unlock the next sector.",
      "Finishing all sectors in a battle unlocks the next battle.",
      "Leaderboard ranking is based on completed sectors, Titan kills, badges, and Scout Medallions."
    ]
  },
  {
    pageNumber: 5,
    leftKicker: "Boss Warning",
    leftTitle: "Special Titans",
    leftImage: "/images/howto-book-9.png",
    leftText: "Boss Titans are larger, stronger, and use special attack patterns. Learn their movement before attacking.",
    leftTip: "When a boss charges, dodge first. Attack after it slows down or becomes stunned.",

    kicker: "Page 5",
    title: "Boss Battles",
    image: "/images/howto-book-10.png",
    bodyType: "list",
    bodyItems: [
      "Female Titan patrols the battlefield and attacks after warning signs.",
      "Armored Titan follows the player and can be stunned after repeated attacks.",
      "Beast Titan patrols and performs fast charge attacks.",
      "Boss Titans can take body damage, but still require a nape hit to die.",
      "Use movement, grapple, and timing instead of attacking blindly."
    ]
  }
];

async function seedHowToPages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await HowToPage.deleteMany({});
    await HowToPage.insertMany(howToPages);

    console.log("HowTo pages seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedHowToPages();