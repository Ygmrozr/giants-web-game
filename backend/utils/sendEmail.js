import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({

  service:"gmail",

  auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
  }

})

export const sendVerificationEmail = async (email,token)=>{

  const url = `http://localhost:5000/verify/${token}`

  await transporter.sendMail({

    from:process.env.EMAIL_USER,

    to:email,

    subject:"Email Verification",

    html:`Click this link to verify your email and login: <a href="${url}">${url}</a>`

  })

}