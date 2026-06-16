import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

});

import path from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"
import session from "express-session"
import validator from "validator"
import User from "./models/User.js"
import Score from "./models/Score.js"
import multer from "multer";
import HowToPage from "./models/HowToPage.js";
import gameLevels from "./data/gameLevels.js";


const app = express()



console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASS)


// body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

///static files (resimler, css vb)
app.use(express.static("public"))

///session 
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret_session_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 // 1 saat
  }
}))


// Locals
app.use((req,res,next)=>{
  res.locals.error = null
  res.locals.success = null
  res.locals.currentUser = req.session.user || null
  next()
})

// EJS ayarı
app.set("view engine", "ejs")

// dirname ayarı (ES modules için gerekli)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set("views", path.join(__dirname, "views"))


// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB bağlı!")
})
.catch((err) => {
    console.log("MongoDB bağlantı hatası:", err)
})


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const stageData = [
  {
    id: 1,
    name: "Trost",
    story: "The walls are breached. Stand your ground, eliminate the threat, and help reclaim the city from the Titans."
  },
  {
    id: 2,
    name: "Karanese",
    story: "Karanese District — Advance from Karanese into the forest of giant trees. Navigate the terrain, avoid danger, and complete your mission."
  },
  {
    id: 3,
    name: "Stohess",
    story: "A hidden threat emerges within the walls. Uncover the truth and confront the enemy lurking among humanity."
  },
  {
    id: 4,
    name: "Castle Utgard",
    story: "Surrounded and outnumbered, you must fight through the night. Hold your position and survive against overwhelming odds."
  },
  {
    id: 5,
    name: "Shiganshina",
    story: "The decisive battle begins. Face the strongest Titans and fight to reclaim what humanity has lost."
  }
];


const titleList = [
  { name: "Recruit", minKills: 0 },
  { name: "Cadet", minKills: 5 },
  { name: "Titan Slayer ", minKills: 15 },
  { name: "Scout Veteran", minKills: 30 },
  { name: "Abnormal Hunter", minKills: 60 },
  { name: "Elite Titan Slayer", minKills: 100 },
  { name: "Eternal Scout", minKills: 150 },
  { name: "Blade Master", minKills: 200 },
  { name: "Humanity's Wrath", minKills: 250 },
  { name: "Titan Reaper", minKills: 300 },
  { name: "Humanity's Strongest", minKills: 500 }
];

const chestRewards = [
  {
    type: "coins",
    amount: 50,
    rarity: "common",
    weight: 35
  },
  {
    type: "coins",
    amount: 75,
    rarity: "common",
    weight: 25
  },
  {
    type: "badge",
    badgeKey: "armin_scout",
    rarity: "rare",
    weight: 15
  },
  {
    type: "badge",
    badgeKey: "sasha_potato",
    rarity: "rare",
    weight: 15
  },
  {
    type: "badge",
    badgeKey: "historia_queen",
    rarity: "epic",
    weight: 5
  },
  {
    type: "badge",
    badgeKey: "mikasa_scarf",
    rarity: "epic",
    weight: 4
  },
  {
    type: "badge",
    badgeKey: "mikasa_elite",
    rarity: "legendary",
    weight: 0.7
  },
  {
    type: "badge",
    badgeKey: "wings_gold",
    rarity: "legendary",
    weight: 0.3
  }
];

const chestConfigs = {
  scout: {
    name: "Scout Chest",
    price: 1,
    rewards: [
      { type: "coins", amount: 50, rarity: "common", weight: 35 },
      { type: "coins", amount: 100, rarity: "common", weight: 20 },
      { type: "gasKit", amount: 1, rarity: "common", weight: 18 },
      { type: "medkit", amount: 1, rarity: "rare", weight: 12 },
      { type: "badge", badgeKey: "armin_scout", rarity: "rare", weight: 8 },
      { type: "badge", badgeKey: "sasha_potato", rarity: "rare", weight: 7 }
    ]
  },

  elite: {
    name: "Elite Chest",
    price: 3,
    rewards: [
      { type: "coins", amount: 200, rarity: "common", weight: 25 },
      { type: "gasKit", amount: 2, rarity: "rare", weight: 18 },
      { type: "medkit", amount: 2, rarity: "rare", weight: 16 },
      { type: "boostCore", amount: 1, rarity: "epic", weight: 14 },
      { type: "badge", badgeKey: "historia_queen", rarity: "epic", weight: 12 },
      { type: "badge", badgeKey: "mikasa_scarf", rarity: "epic", weight: 10 },
      { type: "coins", amount: 500, rarity: "epic", weight: 5 }
    ]
  },

  legend: {
    name: "Legend Chest",
    price: 3,
    rewards: [
      { type: "coins", amount: 500, rarity: "rare", weight: 25 },
      { type: "gasKit", amount: 3, rarity: "rare", weight: 18 },
      { type: "medkit", amount: 3, rarity: "rare", weight: 16 },
      { type: "boostCore", amount: 2, rarity: "epic", weight: 14 },
      { type: "reviveToken", amount: 1, rarity: "legendary", weight: 10 },
      { type: "badge", badgeKey: "mikasa_elite", rarity: "legendary", weight: 9 },
      { type: "badge", badgeKey: "wings_gold", rarity: "legendary", weight: 8 }
    ]
  }
};
    const badgePool = [
  {
    key: "armin_scout",
    name: "Armin Scout Rozeti",
    rarity: "rare",
    icon: "/images/badges/armin_scout.png"
  },
  {
    key: "sasha_potato",
    name: "Sasha Potato Rozeti",
    rarity: "rare",
    icon: "/images/badges/sasha_potato.png"
  },
  {
    key: "historia_queen",
    name: "Historia Queen Rozeti",
    rarity: "epic",
    icon: "/images/badges/historia_queen.png"
  },
  {
    key: "mikasa_scarf",
    name: "Mikasa Scarf Rozeti",
    rarity: "epic",
    icon: "/images/badges/mikasa_scarf.png"
  },
  {
    key: "mikasa_elite",
    name: "Elite Mikasa Rozeti",
    rarity: "legendary",
    icon: "/images/badges/mikasa_elite.png"
  },
  {
    key: "wings_gold",
    name: "Golden Wings Rozeti",
    rarity: "legendary",
    icon: "/images/badges/wings_gold.png"
  }
];


function getBadgeScore(user) {
  if (!Array.isArray(user.ownedBadges)) return 0;

  return user.ownedBadges.reduce((total, badgeKey) => {
    const badge = getBadgeByKey(badgeKey);
    if (!badge) return total;

    if (badge.rarity === "legendary") return total + 500;
    if (badge.rarity === "epic") return total + 250;
    if (badge.rarity === "rare") return total + 100;

    return total + 50;
  }, 0);
}

function getLeaderboardPower(user) {
  const completedSectorCount = Array.isArray(user.completedSectors)
    ? user.completedSectors.length
    : 0;

  return (
    completedSectorCount * 1000 +
    (user.titanKills || 0) * 20 +
    getBadgeScore(user) +
    (user.coins || 0)
  );
}

function getLevelFromScore(score){
  const safeScore = Math.max(0, Number(score) || 0);
  return Math.floor(Math.sqrt(safeScore / 500)) + 1;
}


function getLevelMinScore(level){
  return Math.pow(level - 1, 2) * 500;
}

function getNextLevelScore(level){
  return Math.pow(level, 2) * 500;
}

function getTitleByKills(titanKills) {
  if (titanKills >= 500) return "Humanity's Strongest";
  if (titanKills >= 300) return "Titan Reaper";
  if (titanKills >= 250) return "Humanity's Wrath";
  if (titanKills >= 200) return "Blade Master";
  if (titanKills >= 150) return "Eternal Scout";
  if (titanKills >= 100) return "Elite Titan Slayer";
  if (titanKills >= 60) return "Abnormal Hunter";
  if (titanKills >= 30) return "Scout Veteran";
  if (titanKills >= 15) return "Titan Slayer";
  if (titanKills >= 5) return "Cadet";
  return "Recruit";
}

function getUnlockedTitlesByKills(titanKills) {
  return titleList
    .filter(title => titanKills >= title.minKills)
    .map(title => title.name);
}

function getRandomChestReward() {
  const totalWeight = chestRewards.reduce((sum, reward) => sum + reward.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const reward of chestRewards) {
    roll -= reward.weight;

    if (roll <= 0) {
      return reward;
    }
  }

  return chestRewards[0];
}

function getRandomWeightedReward(rewards) {
  const totalWeight = rewards.reduce((sum, reward) => {
    return sum + reward.weight;
  }, 0);

  let roll = Math.random() * totalWeight;

  for (const reward of rewards) {
    roll -= reward.weight;

    if (roll <= 0) {
      return reward;
    }
  }

  return rewards[0];
}

function getBadgeByKey(key) {
  return badgePool.find(badge => badge.key === key);
}

function getLevelRewards(level){
  const rewards = [];

  rewards.push(`${level * 50} Scout Medallions`);

  if(level % 5 === 0){
    rewards.push("Veteran Scout Bonus");
  }

  if(level % 10 === 0){
    rewards.push("Elite Scout Milestone");
  }

  return rewards;
}


function calculateSectorGrade({ bestCombo, titanKills, medals, score }) {
  let points = 0;

  points += Math.min(Number(bestCombo) || 0, 8) * 10;
  points += Math.min(Number(titanKills) || 0, 8) * 12;
  points += Math.min(Number(medals) || 0, 12) * 6;
  points += Math.min(Math.floor((Number(score) || 0) / 250), 10) * 5;

  if (points >= 170) return "S+";
  if (points >= 135) return "S";
  if (points >= 105) return "A";
  if (points >= 75) return "B";
  if (points >= 45) return "C";
  return "D";
}




// ---------------- ROUTES ----------------

/////////////// ana sayfa
app.get("/", (req,res)=>{
    res.redirect("/login")
})

////////////// login sayfası
app.get("/login",(req,res)=>{
  res.render("login",{error:null, success:null})
})

/////////////// register sayfası
app.get("/register",(req,res)=>{
  res.render("register",{error:null,success:null})
  
})

////////// hesabım
app.get("/account", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    const level = getLevelFromScore(user.totalScore);

    return res.render("account", {
      user: user.toObject ? user.toObject() : user,
      level
    });

  }catch(err){
    console.log("ACCOUNT ERROR:", err);
    return res.redirect("/menu");
  }
});

////////// how to play
app.get("/how-to-play", async (req, res) => {
  try {
    const pages = await HowToPage.find().sort({ pageNumber: 1 }).lean();

    res.render("how-to-play", { pages });
  } catch (error) {
    console.error("How to Play pages fetch error:", error);
    res.status(500).send("How to Play sayfası yüklenemedi.");
  }
});

////////// market
app.get("/market", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    const marketItems = [
  {
    key: "default",
    name: "Default Skin",
    price: 0,
    preview: "/images/player_skins/default/07_idle.png"
  },
  {
    key: "eren",
    name: "Eren Jaeger",
    price: 200,
    preview: "/images/player_skins/eren/07_idle.png"
  },
  {
    key: "mikasa",
    name: "Mikasa Ackerman",
    price: 300,
    preview: "/images/player_skins/mikasa/07_idle.png"
  },
  {
    key: "armin",
    name: "Armin Arlert",
    price: 500,
    preview: "/images/player_skins/armin/07_idle.png"
  },
  {
    key: "sasha",
    name: "Sasha Braus",
    price: 700,
    preview: "/images/player_skins/sasha/07_idle.png"
  },
  {
    key: "historia",
    name: "Historia Reiss",
    price: 700,
    preview: "/images/player_skins/historia/07_idle.png"
  }
];

    return res.render("market", { user, marketItems });
  }catch(err){
    console.log("MARKET ERROR:", err);
    return res.redirect("/menu");
  }
});

//////////profile
app.get("/profile", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    if(!user){
      return res.redirect("/menu");
    }

    const scores = await Score.find({ userId: user._id })
      .sort({ score: -1 })
      .limit(3);

    const ownedBadgeItems = badgePool.filter(badge =>
      user.ownedBadges && user.ownedBadges.includes(badge.key)
    );

    const completedSectorCount = Array.isArray(user.completedSectors)
  ? user.completedSectors.length
  : 0;

const badgeScore = getBadgeScore(user);

    return res.render("profile", {
  profileUser: user.toObject ? user.toObject() : user,
  scores,
  ownedBadgeItems,
  completedSectorCount,
  badgeScore
});

  }catch(err){
    console.log("PROFILE ERROR:", err);
    return res.redirect("/menu");
  }
});


app.get("/game/:level/:sector", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const level = Number(req.params.level);
    const sector = Number(req.params.sector);
    const devMode = req.query.dev === "1";

    const user = await User.findById(req.session.user.id);

    if (!user) {
      return res.redirect("/login");
    }

    const levelData = gameLevels[level];
    const sectorData = levelData?.sectors?.[sector];

    if (!levelData || !sectorData) {
      return res.status(404).send("Level or sector not found.");
    }

    const currentLevel = Number(user.currentLevel || 1);
const currentSector = Number(user.currentSector || 1);

const isUnlocked =
  user.isAdmin ||
  level < currentLevel ||
  (level === currentLevel && sector <= currentSector) ||
  (level === 1 && sector === 1);

    const canBypass = devMode && user.isAdmin;

    if (!isUnlocked && !canBypass) {
      return res.redirect("/map");
    }

    
    res.render("game", {
      user,
      level,
      sector,
      levelData,
      sectorData,
      devMode: canBypass,
      musicSrc: "/sounds/game-music.mp3"
    });
  } catch (error) {
    console.error("Game route error:", error);
    res.status(500).send("Game could not be loaded.");
  }
});


app.post("/chest/open/:type", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
 const chest = chestConfigs[req.params.type];


 if (!chest) {
  return res.status(400).json({
    success: false,
    message: "Sandık bulunamadı."
  });
}

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Login gerekli."
      });
    }

const chestPrice = chest.price;

    if ((user.coins || 0) < chestPrice) {
      return res.status(400).json({
        success: false,
        message: "Yeterli Keşif Madalyonu yok."
      });
    }

    if (!Array.isArray(user.ownedBadges)) {
      user.ownedBadges = [];
    }

    user.coins -= chestPrice;

    const reward = getRandomWeightedReward(chest.rewards);

    const result = {
      type: reward.type,
      rarity: reward.rarity,
      duplicate: false,
      coinsGained: 0,
      badge: null
    };

    if (reward.type === "coins") {
      user.coins += reward.amount;
      result.coinsGained = reward.amount;
    }

    if (reward.type === "badge") {
      const badge = getBadgeByKey(reward.badgeKey);

      if (badge) {
        result.badge = badge;

        if (user.ownedBadges.includes(badge.key)) {
          result.duplicate = true;

          const duplicateReward =
            badge.rarity === "legendary" ? 250 :
            badge.rarity === "epic" ? 150 :
            badge.rarity === "rare" ? 90 :
            50;

          user.coins += duplicateReward;
          result.coinsGained = duplicateReward;
        } else {
          user.ownedBadges.push(badge.key);
        }
      }
    }

    await user.save();

    return res.json({
      success: true,
      result,
      coins: user.coins
    });

  } catch (err) {
    console.log("CHEST OPEN ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Sandık açılamadı."
    });
  }
});
//////////avatar
app.post("/account/avatar", requireAuth, upload.single("avatar"), async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    if(req.file){
      user.avatar = "/uploads/" + req.file.filename;
      await user.save();
    }

    return res.redirect("/account");
  }catch(err){
    console.log("AVATAR UPLOAD ERROR:", err);
    return res.redirect("/account");
  }
});

////////// buy item / skin
app.post("/market/buy/:itemKey", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);
    const itemKey = req.params.itemKey;

    const prices = {
      "default": 0,
      "eren": 200,
      "mikasa": 300,
      "armin": 500,
      "sasha": 700,
      "historia": 700
    };

    const price = prices[itemKey];

    if(price === undefined){
      return res.redirect("/market");
    }

    if(user.ownedSkins.includes(itemKey)){
      return res.redirect("/market");
    }

    if(user.coins < price){
      return res.redirect("/market");
    }

    user.coins -= price;
    user.ownedSkins.push(itemKey);

    await user.save();

    return res.redirect("/market");
  }catch(err){
    console.log("BUY ERROR:", err);
    return res.redirect("/market");
  }
});

////////// select skin
app.post("/market/select/:itemKey", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);
    const itemKey = req.params.itemKey;

    if(!user.ownedSkins.includes(itemKey)){
      return res.redirect("/market");
    }

    user.selectedSkin = itemKey;
    await user.save();

    return res.redirect("/market");
  }catch(err){
    console.log("SELECT SKIN ERROR:", err);
    return res.redirect("/market");
  }
});

///////// verify
app.get("/verify/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.send("Invalid verification link");
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.send("User not found");
    }

    user.verified = true;
    await user.save();

    return res.redirect("/login");
  } catch (err) {
    console.log("VERIFY ERROR:", err);
    return res.send("Verification failed");
  }
});

////////// save score
app.post("/save-score", requireAuth, async (req,res)=>{
  try{
    const { score, titanKills, itemsCollected, bestCombo } = req.body;

    const user = await User.findById(req.session.user.id);

    if(!user){
      return res.status(404).json({ success:false, message:"User not found" });
    }


    if(!Array.isArray(user.unlockedTitles)){
      user.unlockedTitles = ["Recruit"];
    }

    const oldLevel = user.level || 1;
    const oldTitle = getTitleByKills(user.titanKills || 0);

    await Score.create({
      userId: user._id,
      username: user.username,
      score: Number(score) || 0,
      titanKills: Number(titanKills) || 0,
      itemsCollected: Number(itemsCollected) || 0,
      bestCombo: Number(bestCombo) || 0
    });

    user.totalScore += Number(score) || 0;
    user.titanKills += Number(titanKills) || 0;
    user.itemsCollected += Number(itemsCollected) || 0;
    //user.coins += Math.floor((Number(score) || 0) / 10);

    if((Number(score) || 0) > user.highestScore){
      user.highestScore = Number(score) || 0;
    }


const currentBestCombo = Number(user.bestCombo) || 0;
const newBestCombo = Number(bestCombo) || 0;

if (newBestCombo > currentBestCombo) {
  user.bestCombo = newBestCombo;
}

    const newLevel = getLevelFromScore(user.totalScore);
    user.level = newLevel;

    if(newLevel > oldLevel){
      req.session.levelUp = `Level Up! Level ${newLevel}`;
      req.session.levelRewards = getLevelRewards(newLevel);
    }

    user.unlockedTitles = getUnlockedTitlesByKills(user.titanKills);
    const newTitle = getTitleByKills(user.titanKills);

    let unlockedTitle = null;
    if(oldTitle !== newTitle){
      unlockedTitle = newTitle;
      req.session.titleUnlocked = `New title unlocked: ${newTitle}`;
    }

    await user.save();

    return res.json({
      success: true,
      unlockedTitle,
      totalScore: user.totalScore,
      highestScore: user.highestScore,
      bestCombo: user.bestCombo,
      level: user.level
    });

  }catch(err){
    console.log("SAVE SCORE ERROR:", err);
    return res.status(500).json({ success:false, message:"Could not save score" });
  }
});


////////////////// register işlemi
app.post("/register", async (req,res)=>{
try{
const {username,email,password,confirmPassword} = req.body
// boş alan kontrol
if(!username || !email || !password || !confirmPassword){
return res.render("register",{error:"Fill in all the fields.",success:null})
}
// email format kontrol
if(!validator.isEmail(email)){
return res.render("register",{error:"Invalid email address",success:null})
}
// password eşleşme
if(password !== confirmPassword){
return res.render("register",{error:"Passwords don't match.",success:null})
}
//password  format
const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_ %*?&]).{8,}$/;

if(!passwordRegex.test(password)){
return res.render("register",{
error:"The password must be at least 8 characters long and must include uppercase letters, lowercase letters, numbers, and special characters.",success:null})
}
//duplicate user kontrol
const existingUser = await User.findOne({
$or:[{username},{email}]
})
if(existingUser){
return res.render("register",{error:"Username or email already in use",success:null})
}
// password hash
const hashedPassword = await bcrypt.hash(password,10)
// kullanıcı oluştur
const user = new User({
  username,
  email,
  password: hashedPassword,

  // New accounts always start with the default soldier.
  ownedSkins: ["default"],
  selectedSkin: "default"
});
await user.save()


/////////////////verify mail
const verifyLink = `http://localhost:5000/verify/${user._id}`

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Verify Your Giants Game Account",

  html: `
  <div style="background:#f4efe6;padding:40px;font-family:Arial,sans-serif;">
    <div style="
      max-width:650px;
      margin:auto;
      background:#ffffff;
      border-radius:14px;
      overflow:hidden;
      box-shadow:0 8px 25px rgba(0,0,0,.12);
    ">

      <div style="
        background:#2b2b2b;
        padding:35px;
        text-align:center;
      ">
        <h1 style="
          color:#f5e6c8;
          margin:0;
          font-size:32px;
        ">
          TITANS GAME
        </h1>

        <p style="
          color:#cdb78f;
          margin-top:10px;
        ">
          Scout Regiment Registration
        </p>
      </div>

      <div style="padding:40px;color:#333;">

        <h2 style="margin-top:0;">
          Welcome, Scout!
        </h2>

        <p>
          Thank you for joining Giants Game.
          Before entering the battlefield, you must verify your email address.
        </p>

        <p>
          Click the button below to activate your account:
        </p>

        <div style="text-align:center;margin:35px 0;">
          <a href="${verifyLink}"
             style="
              background:#8b5e34;
              color:white;
              text-decoration:none;
              padding:15px 36px;
              border-radius:8px;
              display:inline-block;
              font-weight:bold;
              font-size:16px;
             ">
            VERIFY ACCOUNT
          </a>
        </div>

        <p style="font-size:14px;color:#666;">
          If the button does not work, copy the link below into your browser:
        </p>

        <div style="
          background:#f6f6f6;
          padding:12px;
          border-radius:8px;
          word-break:break-all;
          font-size:13px;
          color:#555;
        ">
          ${verifyLink}
        </div>

        <hr style="
          margin:30px 0;
          border:none;
          border-top:1px solid #e0e0e0;
        ">

        <p style="
          font-size:12px;
          color:#888;
          line-height:1.7;
        ">
          This message was sent automatically by Giants Game.<br>
          If you did not create an account, you may safely ignore this email.
        </p>

      </div>
    </div>
  </div>
  `
});


// register sayfasında mesaj göster
return res.render("register",{
error:null,
success:"📧An email verification link has been sent. Please check your email."
})

}catch(err){
console.log("REGISTER ERROR:", err)

return res.render("register",{
error:"An error occurred during registration.",
success:null
})
}

})


/////////login işlemi
app.post("/login", async (req,res)=>{
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.render("login", { error: "User not found", success: null });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render("login", { error: "Incorrect password", success: null });
    }

    if (!user.verified) {
      return res.render("login", { error: "Email address not verified.", success: null });
    }
    user.lastLoginAt = new Date();
    await user.save();

    req.session.user = {
     id: user._id,
     username: user.username,
     email: user.email
};

return res.redirect("/menu");
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.render("login", { error: "Something went wrong." });
  }
});

///////////forgot password
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.render("forgot", {
        error: "Email address required.",
        success: null
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.render("forgot", {
        error: "The email address is not registered.",
        success: null
      });
    }

    const resetLink = `http://localhost:5000/reset-password/${user._id}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password reset",
      html: `
        <h2>Password Reset</h2>
        <p>To reset your password, click the link below.</p>
        <a href="${resetLink}">Reset Password</a>
      `
    });

    return res.render("forgot", {
      error: null,
      success: "The password reset link has been sent to your email address."
    });
  } catch (err) {
    console.log("FORGOT PASSWORD ERROR:", err);
    return res.render("forgot", {
      error: "Something went wrong while sending reset email.",
      success: null
    });
  }
});

///////////reset password
app.post("/reset-password/:id", async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.render("reset", {
        userId: null,
        error: "Invalid reset link.",
        success: null
      });
    }

    if (password !== confirmPassword) {
      return res.render("reset", {
        userId: req.params.id,
        error: "Passwords don't match.",
        success: null
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#_$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.render("reset", {
        userId: req.params.id,
        error: "The password must be at least 8 characters long and must include uppercase letters, lowercase letters, numbers, and special characters.",
        success: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(req.params.id, {
      password: hashedPassword
    });

    return res.render("reset", {
      userId: null,
      error: null,
      success: "Your password has been successfully changed."
    });
  } catch (err) {
    console.log("RESET PASSWORD ERROR:", err);
    return res.render("reset", {
      userId: req.params.id,
      error: "Something went wrong while resetting password.",
      success: null
    });
  }
});

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login")
  }
  next()
}

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("LOGOUT ERROR:", err)
      return res.redirect("/game")
    }
    res.redirect("/login")
  })
})

/////forgot password
app.get("/forgot-password",(req,res)=>{
res.render("forgot",{error:null,success:null})
})

////////menu
app.get("/menu", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    const level = getLevelFromScore(user.totalScore);
    const currentMin = getLevelMinScore(level);
    const nextLevel = getNextLevelScore(level);
    const progress = Math.max(
  0,
  Math.min(
    1,
    (user.totalScore - currentMin) / (nextLevel - currentMin)
  )
);
    const titleUnlocked = req.session.titleUnlocked || null;
    const levelUp = req.session.levelUp || null;
    const levelRewards = req.session.levelRewards || null;

    const nextLevelRewards = getLevelRewards(level + 1);

    req.session.titleUnlocked = null;
    req.session.levelUp = null;
    req.session.levelRewards = null;

    return res.render("menu", {
      user: user.toObject(),
      level,
      progress,
      nextLevel,
      titleUnlocked,
      levelUp,
      levelRewards,
      nextLevelRewards
    });

  }catch(err){
    console.log("MENU ERROR:", err);
    return res.redirect("/login");
  }
});

////////map
app.get("/map", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    const level = getLevelFromScore(user.totalScore);
    const currentMin = getLevelMinScore(level);
    const nextLevel = getNextLevelScore(level);

    const progress = Math.max(
  0,
  Math.min(
    1,
    (user.totalScore - currentMin) / (nextLevel - currentMin)
  )
);

    const titleUnlocked = req.session.titleUnlocked || null;
    req.session.titleUnlocked = null;
    
    const unlockedLevels = Array.isArray(user.unlockedLevels) ? user.unlockedLevels : [1];
  const unlockedStage = Math.max(...unlockedLevels);

    return res.render("map", {
      user: user.toObject ? user.toObject() : user,
      level,
      progress,
      nextLevel,
      titleUnlocked,
      unlockedStage,
      stageData,
      gameLevels
    });

  }catch(err){
    console.log("MAP ERROR:", err);
    return res.redirect("/menu");
  }
});

app.get("/map/:level", requireAuth, async (req, res) => {
  const level = Number(req.params.level);
  const levelData = gameLevels[level];

  if (!levelData) {
    return res.redirect("/map");
  }

  const user = await User.findById(req.session.user.id);

  if (!user) {
    return res.redirect("/login");
  }

  const unlockedLevels = user.unlockedLevels || [1];
  const isAllowed = user.isAdmin || unlockedLevels.includes(level);

  if (!isAllowed) {
    return res.redirect("/map");
  }

  res.render("level-sectors", {
    user: user.toObject ? user.toObject() : user,
    level,
    levelData,
    gameLevels,
    devMode: req.query.dev === "1" && user.isAdmin
  });
});

app.post("/game/:level/:sector/complete", requireAuth, async (req, res) => {
  try {
    const level = Number(req.params.level);
    const sector = Number(req.params.sector);
    const userId = req.session.user.id;

    const {
      score = 0,
      titanKills = 0,
      itemsCollected = 0,
      medals = 0,
      bestCombo = 0
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const sectorData = gameLevels[level]?.sectors?.[sector];
    if (!sectorData) {
      return res.status(400).json({ success: false, message: "Invalid sector" });
    }

    if (!Array.isArray(user.completedSectors)) user.completedSectors = [];
    if (!Array.isArray(user.unlockedLevels)) user.unlockedLevels = [1];
    if (!Array.isArray(user.sectorGrades)) user.sectorGrades = [];

    const sectorKey = `${level}-${sector}`;
    const alreadyCompleted = user.completedSectors.includes(sectorKey);

    if (!alreadyCompleted) {
      user.completedSectors.push(sectorKey);

      user.coins = (user.coins || 0) + (sectorData.reward || 0);
      user.coins += Number(medals || 0) * 10;
    }

    const gradeRank = {
  D: 1,
  C: 2,
  B: 3,
  A: 4,
  S: 5,
  "S+": 6
};

const newGradeData = {
  sectorKey,
  bestCombo: Number(bestCombo) || 0,
  titanKills: Number(titanKills) || 0,
  medals: Number(medals) || 0,
  score: Number(score) || 0,
  grade: calculateSectorGrade({
    bestCombo,
    titanKills,
    medals,
    score
  })
};

let sectorGrade = user.sectorGrades.find(
  item => item.sectorKey === sectorKey
);

let savedSectorGrade;

if (!sectorGrade) {
  user.sectorGrades.push(newGradeData);

  user.totalScore =
    (user.totalScore || 0) + newGradeData.score;

  savedSectorGrade = newGradeData;
} else {
  const oldScore = Number(sectorGrade.score) || 0;
  const oldGradeValue = gradeRank[sectorGrade.grade] || 0;
  const newGradeValue = gradeRank[newGradeData.grade] || 0;

  const gradeImproved =
    newGradeValue > oldGradeValue;

  const sameGradeWithHigherScore =
    newGradeValue === oldGradeValue &&
    newGradeData.score > oldScore;

  // Total score stores the best sector score.
  if (newGradeData.score > oldScore) {
    user.totalScore =
      (user.totalScore || 0) +
      (newGradeData.score - oldScore);
  }

  // Replace the complete sector record only when the result is better.
  if (gradeImproved || sameGradeWithHigherScore) {
    sectorGrade.grade = newGradeData.grade;
    sectorGrade.score = newGradeData.score;
    sectorGrade.bestCombo = newGradeData.bestCombo;
    sectorGrade.titanKills = newGradeData.titanKills;
    sectorGrade.medals = newGradeData.medals;
  } else if (newGradeData.score > oldScore) {
    // Keep the better grade, but store the higher score.
    sectorGrade.score = newGradeData.score;
  }

  savedSectorGrade = sectorGrade;
}

  

    user.titanKills = (user.titanKills || 0) + Number(titanKills || 0);
    user.itemsCollected = (user.itemsCollected || 0) + Number(itemsCollected || 0);

    if (!user.highestScore || Number(score || 0) > user.highestScore) {
      user.highestScore = Number(score || 0);
    }
    const newUserLevel = getLevelFromScore(user.totalScore);
user.level = newUserLevel;

    await Score.create({
      userId: user._id,
      username: user.username,
      score: Number(score || 0),
      titanKills: Number(titanKills || 0),
      itemsCollected: Number(itemsCollected || 0),
      bestCombo: Number(bestCombo) || 0
    });

    let nextLevel = level;
    let nextSector = sector + 1;

    if (sector >= 5) {
      nextLevel = level + 1;
      nextSector = 1;

      if (gameLevels[nextLevel] && !user.unlockedLevels.includes(nextLevel)) {
        user.unlockedLevels.push(nextLevel);
      }
    }

    const currentLevel = Number(user.currentLevel || 1);
    const currentSector = Number(user.currentSector || 1);

    const isFurtherProgress =
      nextLevel > currentLevel ||
      (nextLevel === currentLevel && nextSector > currentSector);

    if (isFurtherProgress) {
      user.currentLevel = nextLevel;
      user.currentSector = nextSector;
    }

    await user.save();

    req.session.user.currentLevel = user.currentLevel;
    req.session.user.currentSector = user.currentSector;
    req.session.user.unlockedLevels = user.unlockedLevels;
    req.session.user.completedSectors = user.completedSectors;
    req.session.user.coins = user.coins;

    return res.json({
      success: true,
      reward: alreadyCompleted ? 0 : sectorData.reward || 0,
      nextLevel: user.currentLevel,
      nextSector: user.currentSector,
      totalScore: user.totalScore,
      titanKills: user.titanKills,
      itemsCollected: user.itemsCollected,
      
      sectorGrade: savedSectorGrade.grade,
sectorBestScore: savedSectorGrade.score
    });

  } catch (err) {
    console.error("COMPLETE SECTOR ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Sector completion failed"
    });
  }
});


///// titles
app.get("/titles", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    return res.render("titles", {
      user: user.toObject(),
      titleList
    });
  }catch(err){
    console.log("TITLES PAGE ERROR:", err);
    return res.redirect("/menu");
  }
});

////////// leaderboard
app.get("/leaderboard", requireAuth, async (req, res) => {
  try {
    const users = await User.find({}).lean();

    const leaderboardUsers = users
      .map(user => {
        const completedSectorCount = Array.isArray(user.completedSectors)
          ? user.completedSectors.length
          : 0;

        const badgeScore = getBadgeScore(user);
        const leaderboardPower = getLeaderboardPower(user);

        let avatar = user.avatar || "/images/default-avatar.png";

        avatar = String(avatar)
          .replace(/\\/g, "/")
          .replace(/^public\//, "");

        if (!avatar.startsWith("/")) {
          avatar = "/" + avatar;
        }

        return {
          _id: user._id,
          username: user.username,
          avatar,
          titanKills: user.titanKills || 0,
          coins: user.coins || 0,
          completedSectorCount,
          badgeCount: Array.isArray(user.ownedBadges)
            ? user.ownedBadges.length
            : 0,
          badgeScore,
          leaderboardPower,
          level: getLevelFromScore(user.totalScore || 0)
        };
      })
      .sort((a, b) => b.leaderboardPower - a.leaderboardPower)
      .slice(0, 10);

    return res.render("leaderboard", {
      topScores: leaderboardUsers
    });
  } catch (err) {
    console.log("LEADERBOARD ERROR:", err);
    return res.redirect("/menu");
  }
});

////////// public user profile
app.get("/user/:id", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.redirect("/leaderboard");
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.redirect("/leaderboard");
    }

    const scores = await Score.find({ userId: user._id })
      .sort({ score: -1 })
      .limit(3);

    const completedSectorCount = Array.isArray(user.completedSectors)
      ? user.completedSectors.length
      : 0;

    const ownedBadgeItems = badgePool.filter(badge =>
      Array.isArray(user.ownedBadges) &&
      user.ownedBadges.includes(badge.key)
    );

    const badgeScore = getBadgeScore(user);

    return res.render("profile", {
      profileUser: user.toObject ? user.toObject() : user,
      scores,
      completedSectorCount,
      ownedBadgeItems,
      badgeScore,
      isOwnProfile:
        String(req.session.user.id) === String(user._id)
    });

  } catch (err) {
    console.log("PUBLIC PROFILE ERROR:", err);
    return res.redirect("/leaderboard");
  }
});

///////reset password
app.get("/reset-password/:id",(req,res)=>{
res.render("reset",{
userId:req.params.id,
error:null,
success:null
})
})

//////////game
app.get("/game", requireAuth, (req,res)=>{
  const username = req.session.user.username
  res.render("game",{username})
})


// server başlat
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server ${PORT} portunda başladı`)
})