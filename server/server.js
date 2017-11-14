const express = require('express');
const app = express();
const router = require('./router.js');
const bodyparser = require("body-parser");


var serv = new Server();


function Server() {

    app.use(bodyparser.urlencoded({ extended: true }));
    app.use(bodyparser.json());
    
    app.use(router);

    var server = app.listen(8081, function () {
        var host = server.address().address
        var port = server.address().port
       
        console.log("App running...");
        
    });
}