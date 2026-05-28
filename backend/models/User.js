import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  verified: {
    type: Boolean,
    default: false
  },

  avatar: {
    type: String,
    default: "/images/default-avatar.png"
  },

  totalScore: {
    type: Number,
    default: 0
  },

  highestScore: {
    type: Number,
    default: 0
  },

  titanKills: {
    type: Number,
    default: 0
  },

  itemsCollected: {
    type: Number,
    default: 0
  },

  coins: {
    type: Number,
    default: 0
  },

  level: { 
    type: Number, 
    default: 1 
  },

  ownedSkins: {
    type: [String],
    default: ["default"]
  },

  selectedSkin: {
    type: String,
    default: "default"
  },

  unlockedTitles: {
  type: [String],
  default: ["Recruit"]
  },

  unlockedCharacters: {
  type: [String],
  default: ["eren"]
},

currentLevel: {
  type: Number,
  default: 1
},

currentSector: {
  type: Number,
  default: 1
},

unlockedLevels: {
  type: [Number],
  default: [1]
},

completedSectors: {
  type: [String],
  default: []
},

isAdmin: {
  type: Boolean,
  default: false
},

sectorGrades: [
  {
    sectorKey: String,
    bestCombo: { type: Number, default: 0 },
    titanKills: { type: Number, default: 0 },
    medals: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    grade: { type: String, default: "D" }
  }
],

selectedBadge: {
  type: String,
  default: null
},

ownedBadges: {
  type: [String],
  default: []
},

  lastLoginAt: {
    type: Date,
    default: null
  },

  gasKits: { type: Number, default: 0 },
medkits: { type: Number, default: 0 },
boostCores: { type: Number, default: 0 },
reviveTokens: { type: Number, default: 0 }
  

  
}, { timestamps: true });


userSchema.virtual("title").get(function () {
  if (this.titanKills >= 500) return "Cadet";
  if (this.titanKills >= 300) return "Cadet";
  if (this.titanKills >= 250) return "Cadet";
  if (this.titanKills >= 200) return "Cadet";
  if (this.titanKills >= 150) return "Cadet";
  if (this.titanKills >= 100) return "Humanity’s Strongest";
  if (this.titanKills >= 60) return "Elite Titan Slayer";
  if (this.titanKills >= 30) return "Scout Veteran";
  if (this.titanKills >= 15) return "Titan Hunter";
  if (this.titanKills >= 5) return "Cadet";
  return "Recruit";
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

export default mongoose.model("User", userSchema);