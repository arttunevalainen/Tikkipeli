const express = require('express');
const app = express();
const router = require('./router.js');
const Tikki = require('./Tikki.js');


var serv = new Server();


function Server() {

    var tikki = new Tikki();

    app.use('/' , router);
    app.use('/kek', router);

    var server = app.listen(8081, function () {
        var host = server.address().address
        var port = server.address().port
       
        console.log("App running...");
        
    });
}