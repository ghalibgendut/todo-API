const conn = require('../config/database/index_db.js')
const router = require('express').Router()
const auth = require('../config/auth/index_auth');


// READ TODO
router.get('/todo', auth, (req,res)=>{
    const sql = `SELECT * FROM todos WHERE user_id = ?`;
    const data = req.user.id;


    conn.query(sql, data, (err, result)=>{
        if (err) {
            return res.send(err.sqlMessage);
        }

        res.send({
            message: 'Berhasil',
            result: result
        })
    })
})

// CREATE TODO
router.post('/todo', auth,(req,res)=>{
    // req.body = {user_id, description}

    const sql = `INSERT INTO todos SET ?`
    const data = {user_id: req.user.id, description:req.body.description };

    conn.query(sql,data, (err,result)=>{
        if (err) {
            return res.send(err.sqlMessage);
        }

        res.send({
            message: 'Todo Berhasil dibuat',
            id: result.insertId
        });
    })
})

// UPDATE TODO
router.patch ('/todo/:todoid', auth, (req, res)=>{
    const sql = `UPDATE todos SET ? WHERE id = ? AND user_id = ?`
    const data = [req.body, req.params.todoid, req.user.id]

    conn.query(sql, data, (err, result)=>{
        if (err) {
            return res.send(err.sqlMessage)
        }

        res.send({
            message: "Todo Berhasil di update"
        })
    })
})

// DELETE TODO
router.delete('/todo/:todoid', auth, (req, res)=>{
    const sql = `DELETE FROM todos WHERE id = ? AND user_id = ?`
    const data = [req.params.todoid, req.user.id]

    conn.query(sql, data, (err, result)=>{
        if (err) {
            return res.send(err.sqlMessage)
        }

        res.send({
            message: "Todo Berhasil di hapus"
        })
    })
})








module.exports = router