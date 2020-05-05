const conn = require('../config/mysql.js')
const router = require('express').Router()


// READ TODO
router.get('/user/read/:userid', (req,res)=>{
    const sql = `SELECT * FROM todos WHERE user_id = ?`;
    const data = req.params.userid;


    conn.query(sql, data, (err, result)=>{
        if (err) {
            return res.send(err);
        }

        res.send({
            message: 'Berhasil',
            result: result
        })
    })
})

// CREATE TODO
router.post('/user/todo', (req,res)=>{
    // req.body = {user_id, description}

    const sql = `INSERT INTO todos SET ?`
    const data = req.body;

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
router.patch ('/user/todo/:todoid', (req, res)=>{
    const sql = `UPDATE todos SET ? WHERE id = ?`
    const data = [req.body , req.params.todoid]

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
router.delete('/user/todo/:todoid', (req, res)=>{
    const sql = `DELETE FROM todos WHERE id = ?`
    const data = req.params.todoid

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