var iplocation = require('iplocation');
var satelize = require('satelize');
var traceroute = require('traceroute');
var exec = require('child_process').exec;
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


getRoute('daveseidman.com');

function getRoute(url) {

    console.log("getting route for ", url);
    var command = 'traceroute -I -n ' + url;

    exec(command, function(err, stdout, stderr) {
        if(!err) {
            var array = stdout.match(/[^\r\n]+/g);
            for(var i = 0; i < array.length; i++) {
                var ip = array[i].match(r);
                if(ip) ips.push(ip[0]);
            }
            console.log("traceroute success");
            findIP(0);
        }
        else {

            console.log("traceroute failed");
        }
    });
}


function findIP(index) {

    console.log("finding", ips[index]);

    //iplocation(ips[index], function(error, res) {
    satelize.satelize({ip:ips[index]}, function(error, res) {

        if(!error) {

            console.log(res.latitude, res.longitude);
        }
        else {

            console.log("location lookup failed");
        }

        if(index < ips.length - 1) findIP(index + 1);
    })
}
