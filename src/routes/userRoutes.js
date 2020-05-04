const conn = require('../config/mysql.js');
const router = require('express').Router();
const verifSendEmail = require('../config/verifSendEmail');


// Get all user
router.get('/getAllUser', (req,res)=>{
    const sql = `SELECT * FROM users`

    conn.query(sql, (err, result)=>{
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
router.post('/register', (req,res)=>{
    const {username, name, email, password} = req.body;
    // Query insert
    const sql = `INSERT INTO users (username, name, email, password) 
                VALUES ('${username}', '${name}', '${email}', '${password}')`;

    // Running Query
    conn.query(sql, (err, result)=>{
        // Cek jika ada error
        if (err) {
            return res.send(err);
        }

        // Kirim email verifikasi ke user
        verifSendEmail(name, email, result.insertId)


        // jika berhasil, kirim object
        res.send ({
            message : 'Registrasi Berhasil'
        })
    })
})

// Verify Email
router.get('/verify/:userid', (req,res)=>{
    const sql = `UPDATE users SET verified = true WHERE id = '${req.params.userid}'`

    conn.query(sql, (err, result)=>{
        if (err) {
            return res.send({error: err.sqlMessage})
        }

        res.send('<h1>Verifikasi Berhasil!</h1>')
    })
})








module.exports = router;




