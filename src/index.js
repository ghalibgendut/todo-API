const express = require('express');
const app = express();
const port = 2020;

// ROUTES
const userRouter = require('./routes/userRoutes');
const todoRouter = require('./routes/todoRouters');


app.use(express.json())
app.use(userRouter)
app.use(todoRouter)

app.get('/', (req,res)=>{
    res.send(`<h1>API RUnning at Port : ${port}</h1>`)
});




app.listen(port, ()=>{console.log(`API Running at ${port}`)});