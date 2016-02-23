var app = require('express')();
var express = require('express');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var iplocation = require('iplocation');
var satelize = require('satelize');
var traceroute = require('traceroute');
var exec = require('child_process').exec;

server.listen(80);
app.use('/', express.static('html/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*iplocation('205.186.175.187', function(error, res) {

    if(res) { console.log(res.latitude, res.longitude); }
    else { console.log("location not found");}
})*/

/*traceroute.trace('daveseidman.com', function (err, hops) {

    if(!err) console.log(hops);
})
*/
var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
var ips = [];
var location;
//var coords = [];


app.post('/getRoute', function (req, res) {

    console.log("user searching route for", req.body.site);
    getRoute(req.body.site, function(callback) {

        console.log("getRoute finished");
        res.send(ips);
    });
});

app.post('/getLocation', function (req, res) {

    console.log("user searching route for", req.body.ip);

    satelize.satelize( { ip : req.body.ip }, function(error, locRes) {

        if(!error) {

            console.log(locRes.latitude, locRes.longitude);
            res.send( { lat : locRes.latitude, lng : locRes.longitude } );
        }
        else {
            console.log("location lookup failed");
        }
    });
});



function getRoute(url, callback) {

    console.log("getting route for ", url);
    var command = 'traceroute -I -n -w 3 -q 1 ' + url;

    exec(command, function(err, stdout, stderr) {
        if(!err) {
            var array = stdout.match(/[^\r\n]+/g);
            for(var i = 0; i < array.length; i++) {
                var ip = array[i].match(r);
                if(ip) ips.push(ip[0]);
            }
            console.log("traceroute success");
            return callback();
        }
        else {

            console.log("traceroute failed");
            return callback();
        }
    });
}

/*function findIP(index, callback) {

    console.log("finding", ips[index]);

    //iplocation(ips[index], function(error, res) {
    satelize.satelize({ip:ips[index]}, function(error, res) {

        if(!error) {

            console.log(res.latitude, res.longitude);
            return callback();
        //    coords.push( { lat : res.latitude, lon : res.longitude } );
        }
        else {

            console.log("location lookup failed");
        }

        if(index < ips.length - 1) findIP(index + 1);
        else return callback();
    })
}
*/
