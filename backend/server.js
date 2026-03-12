import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import { sendVerificationEmail } from "./utils/sendEmail.js"
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
import validator from "validator"
import jwt from "jsonwebtoken"

import User from "./models/User.js"

const app = express()

console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASS)

// body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// static files (resimler, css vb)
app.use(express.static("public"))
app.use((req,res,next)=>{
res.locals.error=null
res.locals.success=null
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


// ---------------- ROUTES ----------------


/////////////// ana sayfa
app.get("/", (req,res)=>{
    res.redirect("/login")
})


////////////// login sayfası
app.get("/login",(req,res)=>{
    res.render("login",{error:null})
})


/////////////// register sayfası
app.get("/register",(req,res)=>{
  res.render("register",{error:null,success:null})
  
})

app.get("/verify/:id", async (req,res)=>{

const user = await User.findById(req.params.id)

if(!user){
 return res.send("User not found")
}

user.verified = true
await user.save()

return res.redirect("/login")

})



app.listen(5000,()=>{
  console.log("server çalışıyor")
})

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
password:hashedPassword
})
await user.save()


/////////////////verify mail
const verifyLink = `http://localhost:5000/verify/${user._id}`

await transporter.sendMail({
from:process.env.EMAIL_USER,
to:email,
subject:"Email Verification",

html:`
<h2>Verify email</h2>
<a href="${verifyLink}">Verify your email and log in.</a>
`
})

// register sayfasında mesaj göster
return res.render("register",{
error:null,
success:"📧An email verification link has been sent. Please check your email."
})

}catch(err){

return res.render("register",{
error:"An error occurred during registration.",
success:null
})

}

})


/////////login işlemi
app.post("/login", async (req,res)=>{
const {username,password} = req.body
const user = await User.findOne({username})
if(!user){
return res.render("login",{error:"User not found"})
}
const match = await bcrypt.compare(password,user.password)
if(!match){
return res.render("login",{error:"Incorrect password"})
}
if(!user.verified){
return res.render("login",{error:"Email address not verified."})
}
res.redirect("/game")

})

////////////////////
app.post("/forgot-password", async (req, res) => {

const { email } = req.body

// email boş mu
if(!email){
return res.render("forgot",{
error:"Email address required.",
success:null
})
}

// kullanıcı var mı kontrol et
const user = await User.findOne({email})

if(!user){
return res.render("forgot",{
error:"The email address is not registered.",
success:null
})
}

// reset link oluştur
const resetLink =
`http://localhost:5000/reset-password/${user._id}`

await transporter.sendMail({
from:process.env.EMAIL_USER,
to:email,
subject:"Password reset",
html:`
<h2>Password Reset</h2>
<p>To reset your password, click the link below.</p>
<a href="${resetLink}">Reset Password</a>
`
})

return res.render("forgot",{
error:null,
success:"The password reset link has been sent to your email address."
})

})

///////////////////
app.post("/reset-password/:id", async (req,res)=>{

const {password, confirmPassword} = req.body

// şifreler aynı mı
if(password !== confirmPassword){
return res.render("reset",{
userId:req.params.id,
error:"Passwords don't match.",
success:null
})
}

// güçlü şifre kontrolü
const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.# _$!%*?&]).{8,}$/

if(!passwordRegex.test(password)){
return res.render("reset",{
userId:req.params.id,
error:"The password must be at least 8 characters long and must include uppercase letters, lowercase letters, numbers, and special characters.",
success:null
})
}

// hash
const hashedPassword = await bcrypt.hash(password,10)

await User.findByIdAndUpdate(req.params.id,{
password:hashedPassword
})

// başarılı mesajı
return res.render("reset",{
userId:null,
error:null,
success:"Your password has been successfully changed."
})

})

//////////////////
app.get("/forgot-password",(req,res)=>{
res.render("forgot",{error:null,success:null})
})

//////////////////
app.get("/reset-password/:id",(req,res)=>{
res.render("reset",{
userId:req.params.id,
error:null,
success:null
})
})

// oyun sayfası
app.get("/play",(req,res)=>{
    const username = req.query.username
    res.render("game",{username})
})


// server başlat
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server ${PORT} portunda başladı`)
})