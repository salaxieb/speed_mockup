"use strict";
const nodemailer = require("nodemailer");
console.log("nodemailer", nodemailer)

// async..await is not allowed in global scope, must use a wrapper
async function new_mail(text){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account = await nodemailer.createTestAccount();
  console.log("account created", account)


  var transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    // secure: true, // use SSL
    auth: {
        user: 'postmaster@sandbox2d6284ddc26e403da99dd0707c87ff19.mailgun.org',
        pass: '70fb82c81baf4d19f659628b89d9b4f0-e51d0a44-292b2703'
    }
});

  console.log("transporter created", transporter)

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Mailgun Sandbox" <postmaster@sandbox2d6284ddc26e403da99dd0707c87ff19.mailgun.org>', // sender address
    to: "au00368@renault.com, salaxieb.ildar@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>" + text + "</b>" // html body
  };

  console.log("mails options", mailOptions)

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

new_mail("mail confirmation for SALAKHIEV Ildar").catch(console.error);