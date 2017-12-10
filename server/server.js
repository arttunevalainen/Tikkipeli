var express = require('express');
var app = express();
var cors = require('cors');
var router = require('./router.js');
var bodyparser = require("body-parser");


var serv = new Server();


function Server() {

    app.use(bodyparser.urlencoded({ extended: true }));
    app.use(bodyparser.json());

    app.use(cors());
    
    app.use(router);

    var server = app.listen(8081, function () {
        var host = server.address().address
        var port = server.address().port
       
        console.log("App running on port 8081...");
        
    });
}