const conn = require('../config/mysql.js');
const router = require('express').Router();
const verifSendEmail = require('../config/verifSendEmail');
const bcrypt = require('bcrypt');
const validator = require('validator');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');


// Alamat directori
const fileDir = path.join(__dirname, '../files');


// CONFIG Multer and Sharp
const upload = multer({

    limits: {
        fileSize: 10000000 // Bytes, default 1MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jgp|jpeg|png)$/)) {
            return cb(new Error('Please upload image file (jpg, jpeg, or png)'))
        }
        cb(undefined, true)
    }
})


// UPLOAD AVATAR
router.post('/user/avatar', upload.single('avatar'), async (req, res) => {

    try {
        const avatar = `${req.body.username}-avatar.png`

        // Query upload ke DB
        const sql = `UPDATE users SET avatar = ? WHERE username = ?`
        const data = [avatar, req.body.username]


        // Menyimpan foto di folder
        await sharp(req.file.buffer).resize(200).png().toFile(`${fileDir}/${avatar}`);

        // Simpan nama fotonya di DB
        conn.query(sql, data, (err, result) => {
            if (err) {
                return res.send(err)
            }
        })
        // kirim respon ke user
        res.send('Berhasil Upload!');
    } catch (err) {
        res.send(err.message);
    }

}, (err, req, res, next) => {
    res.send(err)
})

// GET AVATAR
router.get('/user/avatar/:username', (req, res) => {
    const username = req.params.username

    // query cari nama file di DB
    const sql = `SELECT avatar FROM users where username = '${username}'`

    // Kirim file ke client
    conn.query(sql, (err, result) => {
        // jika ada error saat running query
        if (err) {
            return res.send(err);
        }
        try {
            // Menggunakan options
            const avatarName = result[0].avatar;
            // res.send(avatarName)
            const options = {
                root: fileDir
            }
            // Mengirim file sebagai respon
            res.sendFile(avatarName, options, (err)=>{
                if (err) {
                    return res.send(err)
                }
            })

            // Menggunakan absolute path
            // res.sendFile(`${fileDir}/${avatarName}`, (err) => {
            //     if (err) {
            //         return res.send(err)
            //     }
            // })
        } catch (err) {
            res.send(err);
        }
    })
})






// Get all user
router.get('/getAllUser', (req, res) => {
    const sql = `SELECT * FROM users`

    conn.query(sql, (err, result) => {
        if (err) {
            return res.send(err);
        }

        res.send({
            message: 'Berhasil',
            result: result
        })
    })
})

// REGISTER USER
router.post('/register', (req, res) => {
    const { username, name, email, password } = req.body;
    // Query insert
    // const sql = `INSERT INTO users (username, name, email, password) 
    //             VALUES ('${username}', '${name}', '${email}', '${password}')`;
    const sql = `INSERT INTO users SET ?`;
    const data = req.body;

    // Cek fromat email
    let valid = validator.isEmail(data.email);
    if (!valid) {
        return res.send('Email tidak valid!');
    }

    // hash password
    data.password = bcrypt.hashSync(data.password, 8);


    // Running Query
    conn.query(sql, data, (err, result) => {
        // Cek jika ada error
        if (err) {
            return res.send(err);
        }

        // Kirim email verifikasi ke user
        verifSendEmail(data.name, data.email, result.insertId)


        // jika berhasil, kirim object
        res.send({
            message: 'Registrasi Berhasil'
        })
    })
})

// Verify Email
router.get('/verify/:userid', (req, res) => {
    const sql = `UPDATE users SET verified = true WHERE id = '${req.params.userid}'`

    conn.query(sql, (err, result) => {
        if (err) {
            return res.send({ error: err.sqlMessage })
        }

        res.send('<h1>Verifikasi Berhasil!</h1>')
    })
})

// Login
router.post('/user/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = '${username}'`;



    conn.query(sql, (err, result) => {
        // cek error
        if (err) {
            return res.send({ error: err.sqlMessage });
        }
        let user = result[0]

        if (!user) {
            // Jika username tidak ditemukan
            return res.send(`Username tidak ditemukan`);
        }
        // verifikasi password
        let validPass = bcrypt.compareSync(password, user.password);
        if (!validPass) {
            // Jika user memasukan password salah
            return res.send(`Password salah!`);
        }

        // Cek staus verified
        if (!user.verified) {
            return res.send(`Anda belum terverifikasi, silakan cek email anda`);
        }

        // hapus beberapa property
        delete user.password;
        delete user.avatar;
        delete user.verified;

        res.send({
            message: 'Login Berhasil',
            user: user
        })
    })
})







module.exports = router;


