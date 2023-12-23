const express = require('express');
const temporaryUserRouter = require('../components/temporaryUsers/network')
const chatRouter = require('../components/chat/network');
const router = function(server){
    
    server.use('/chat', chatRouter);
    server.use('/users',temporaryUserRouter);

}



module.exports = router;
