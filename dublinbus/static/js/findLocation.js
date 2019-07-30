/**
 * The find location function gets the current location of the user, and then finds the closest stations (0.6 km or less away)
 *
 */
function findLocation() {
    var pos;
    var infowindow = new google.maps.InfoWindow();
    //uses the Google geolocation service
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(pos);
            //marker where the user is
           /* var marker = new google.maps.Marker({
                position: pos,
                map: map,
            });*/
            //load the stops info from the JSON file
            $.getJSON( "/static/files/stops_info.json", function( data ) {
                for (var i = 0; i < data.length; i++) {
                    //get the position of each stop in the file
                    var destPos = new google.maps.LatLng(data[i].stop_lat, data[i].stop_lon);
                    //if the stop in the file is less than 0.6 km away from the user, show it on the map.
                    //info window contains all the info in the content section of the marker.
                    if (distance(data[i].stop_lat, data[i].stop_lon, position.coords.latitude, position.coords.longitude) < .6) {
                        var marker = new google.maps.Marker({
                            position: destPos,
                            map: map,
                            title: data[i].actual_stop_id + "\n" + data[i].stop_name,
                            // content is the stop info
                            content: '<div id="content' + data[i].actual_stop_id + '" >' + '<div id=stop' + data[i].actual_stop_id + '>' + '<p><b>Stop ID:</b>  ' + data[i].actual_stop_id + '</p>' +
                        '<p><b>Stop name:</b><br>' + data[i].stop_name + '</p><br>' + '<p><b>Serving route:</b>' + '**</p>' + '</div>'
                        + '<button id="realtime" onclick="get_real_time_data(' + data[i].actual_stop_id + ')">View real time info</a></button> ' +
                                '<button onclick = "routeFromHere(\''+data[i].stop_name+'\')" class = "btn-primary">Route from here</button></div>'
                        });
                        markers.push(marker);
                        //add an on click for the markers
                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent(marker.content);
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                    }
                }
            });
        }, function () {
            handleLocationError(true, infowindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infowindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infowindow, pos) {
        infowindow.setPosition(pos);
        infowindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infowindow.open(map);
    }
}



//distance calculator between two latitudes and longitudes.
function distance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        return dist * 1.609344 ;
    }
}
