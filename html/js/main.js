var map, $map;
var $web;
var ips;d
var markerArray = [];

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

    $.post("http://localhost:80/getRoute", { site:$web.val() } , function(data) {

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

    $.post("http://localhost:80/getLocation", { ip:ips[index] }, function(data) {

        if(index < ips.length - 2) locateIP(index+1);
    });
}


function addMarker(data) {

    var marker = new google.maps.Marker({
        position: data,
        map: map/*,
        title: 'Hello World!'*/
      });
    markerArray.push(marker);
}
