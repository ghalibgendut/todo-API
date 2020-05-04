const nodemailer =  require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

// Config
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'ghalibsasmito@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
})


// Mail
const mail = {
    from: 'Ghalib Sasmito <ghalibsasmito@gmail.com',
    to : 'ghalibgendut@gmail.com',
    subject: 'Testing Nodemailer',
    html: '<h1>Bisa Gan</h1>'
}

// Send Email
transporter.sendMail(mail,(err,result)=>{
    if (err) {
        return console.log({error: err.message});
    }

    console.log(`Email kekirim`);
    
})