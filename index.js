var iplocation = require('iplocation');
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
var command = 'traceroute -I -n daveseidman.com';
var ips = [];

function getRoute() {
    exec(command, function(err, stdout, stderr) {
        if(!err) {
            var array = stdout.match(/[^\r\n]+/g);
            for(var i = 0; i < array.length; i++) {
                var ip = array[i].match(r);
                if(ip) ips.push(ip[0]);
            }
        }
    });
}
