"use strict";

var map, $map;
var $web;
var ips;
var $ipList;
var markerArray = [];
var lastPosition;
var serverAddress;

getEnvironment();

function getEnvironment() {

    var isLocal = (window.location.host.indexOf('localhost') > -1 || window.location.host.indexOf('192') > -1);
    if(isLocal) {
        // $.getJSON("config.json", function(data) {
        //     serverAddress = 'http://' + data.network.ip + ':80';
        // });
        serverAddress = 'http://localhost:80';
    }
    else {
        serverAddress = 'http://54.187.226.253:80';
    }
}

$(document).on("ready", function() {

    $map = $('#map');
    $web = $('#web');
    $ipList = $('#ipList');

    map = new google.maps.Map($map[0], {
        center: {lat: 37.0550808, lng: -96.5526939},
        zoom: 5
    });

    $web.data('startText', $web.val());
    $web.on('focus', inField);
    $web.on('blur', outField);
    $web.keydown(function(e) { if(e.keyCode == 13) startTrace(); });
});

function inField() {

    var $field = $(this);
    if($field.val() == $field.data('startText')) $field.val('');
}

function outField() {

    var $field = $(this);
    if($field.val() == '') $field.val($field.data('startText'));
}

function startTrace() {

    console.log("starting trace of", $web.val());

    $ipList.empty();
    for(var i = 0; i < markerArray.length; i++) {

        markerArray[i].setMap(null);
    }
    markerArray.length = 0;
    lastPosition = undefined;


    $.post(serverAddress + '/getRoute', { site:$web.val() } , function(data) {

        ips = data;
        for(var i = 0; i < data.length; i++) {

            var ip = data[i];
            var $ip = $('<p>' + ip + '</p>');
            $ipList.append($ip);
        }
        locateIPs();
    });
}


function locateIPs() {

    var index = 0;
    locateIP(index);
}

function locateIP(index) {


    $.post(serverAddress + '/getLocation', { ip:ips[index] }, function(data) {

        addMarker(data);
        if(index < ips.length - 2) locateIP(index+1);
    });
}


function addMarker(data) {

    var marker = new google.maps.Marker({
        position: data,
        map: map
      });

      markerArray.push(marker);

    if(lastPosition) {
        var pth = [ lastPosition, data ];
        console.log(pth);

        var line = new google.maps.Polyline({
            path: pth,
            geodesic: true,
            strokeColor: "#FFA7B2",
            strokeOpacity: 0.5,
            strokeWeight: 2,
            map: map
        });
    }

    lastPosition = data;

}
