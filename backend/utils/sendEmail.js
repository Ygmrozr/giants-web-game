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

    subject: "Verify Your Titans Game Account",

    html: `
<div style="
  background:#f5f1e8;
  padding:40px;
  font-family:Arial,sans-serif;
">
  <div style="
    max-width:600px;
    margin:auto;
    background:white;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 4px 20px rgba(0,0,0,0.1);
  ">

    <div style="
      background:#2c2c2c;
      color:white;
      text-align:center;
      padding:30px;
    ">
      <h1 style="margin:0;">Giants Game</h1>
      <p style="margin-top:10px;color:#d0d0d0;">
        Scout Registration
      </p>
    </div>

    <div style="padding:35px; color:#333;">
      <h2>Welcome, Scout!</h2>

      <p>
        Thank you for creating your account.
        Before entering the battlefield, please verify your email address.
      </p>

      <p>
        Click the button below to activate your account:
      </p>

      <div style="text-align:center;margin:35px 0;">
        <a href="${url}" style="
          background:#8b5e34;
          color:white;
          text-decoration:none;
          padding:14px 32px;
          border-radius:8px;
          font-weight:bold;
          display:inline-block;
        ">
          Verify Email
        </a>
      </div>

      <p style="font-size:14px;color:#666;">
        If the button does not work, copy and paste the following link into your browser:
      </p>

      <p style="
        word-break:break-all;
        font-size:13px;
        color:#555;
      ">
        ${url}
      </p>

      <hr style="margin:25px 0;border:none;border-top:1px solid #eee;">

      <p style="
        font-size:12px;
        color:#888;
      ">
        This email was sent automatically by Giants Game.
        If you did not create an account, you can safely ignore this message.
      </p>
    </div>

  </div>
</div>
`

  })

}