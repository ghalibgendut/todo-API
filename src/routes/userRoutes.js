const conn = require('../config/mysql.js');
const router = require('express').Router();


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

        // jika berhasil, kirim object
        res.send ({
            message : 'Registrasi Berhasil',
            result : result
        })
    })
})


module.exports = router;




