const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const generatePasscode = () => {
  return Math.floor(Math.random() * 900000) + 100000;
}

const hashPasscode = (passcode) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(`${passcode}`, salt);
}

const verifyPasscode = (passcode, hash) => {
  return bcrypt.compareSync(passcode, hash);
}

const sendMail = (email, passcode) => {
  console.log("sendMail", email, passcode);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_PASS
    }
  });
  
  const mailOptions = {
    from: process.env.GMAIL_ACCOUNT,
    to: email,
    subject: 'Login passcode for your app',
    text: `Your login passcode is ${passcode}. This passcode will expire in 10 minutes.`
  };
  
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
} 

module.exports = {
  generatePasscode,
  hashPasscode,
  verifyPasscode,
  sendMail
}