const express = require('express');
const path = require('path');
const middlewareCheckUsername = require('./Middleware(CheckUsername)');

const router = express.Router();


router.get("/",middlewareCheckUsername,(req,res)=>{
    const filePath = path.join(__dirname, '../../public/views/chat/index.html');
    res.sendFile(filePath);
})

module.exports = router;