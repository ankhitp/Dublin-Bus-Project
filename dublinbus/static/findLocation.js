function findLocation() {
    var pos;
    var infowindow = new google.maps.InfoWindow();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(pos);
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
            });
            $.getJSON( "/static/files/stops_info.json", function( data ) {
                for (var i = 0; i < data.length; i++) {
                    var destPos = new google.maps.LatLng(data[i].stop_lat, data[i].stop_lon);
                    if (distance(data[i].stop_lat, data[i].stop_lon, position.coords.latitude, position.coords.longitude) < 1) {
                        var marker = new google.maps.Marker({
                            position: destPos,
                            map: map,
                        });
                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent("HELLO");
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                    }
                }
            });
        }, function () {
            handleLocationError(true, LocationWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, LocationWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, LocationWindow, pos) {
        LocationWindow.setPosition(pos);
        LocationWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        LocationWindow.open(map);
    }
}

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
