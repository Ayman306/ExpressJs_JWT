
require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require("jsonwebtoken")
app.use(express.json())
const post =[
    {
        username:"Kyle",
        title :"Post1"
    },
    {
        username:"Jim",
        title :"Post2"
    }
]

app.get('/post',authenticateToken,(req,res)=>{
    res.json(post.filter(post => post.username === req.user.name))
})


function authenticateToken(req,res,next){
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader!== 'undefined'){
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        jwt.verify(bearerToken,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err){
               return res.sendStatus(403)
            }else{
                req.user=user
                next()
            }
        })
    }else{
        res.sendStatus(401)
    }
}

app.listen(3000)