const nodemailer =  require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()


const verifSendEmail = (name, email, userid) =>{
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
        to : email,
        subject: 'Verifikasi Email',
        html: `
            <h1>Hello, ${name}</h1>
            <h2><a href='http://localhost:2020/verify/${userid}'>Klik Untuk verifikasi akun</a></h2>
        `
    }
    
    // Send Email
    transporter.sendMail(mail,(err,result)=>{
        if (err) {
            return console.log({error: err.message});
        }
    
        console.log(`Email kekirim`);
        
    })
}
module.exports = verifSendEmail;
