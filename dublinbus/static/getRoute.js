/**
 * This function does a few things. First, th
 * @param i
 * @param url
 */
function getRoute(i, url) {
    var infowindow = new google.maps.InfoWindow();
    var locations = [];
    document.getElementById("panel").innerHTML = "<h3> Directions </h3>";
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    //xhttp.setRequestHeader('X-CSRF-Token', 'abcdef');
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var returnData = JSON.parse(this.responseText);
            var parseMe = returnData['Res']['Connections']["Connection"];
            var parsed = parseMe[i]["Sections"]["Sec"];
            for (var x = 0; x < parsed.length; x++) {
                if (parsed[x]["mode"] == 20 && x != parsed.length - 1) {
                    document.getElementById('panel').insertAdjacentHTML('beforeend',
                        "<img src='../static/img/walk.png' style='width:32px;height:32px';> <p>Walk to " +
                        parsed[x]["Arr"]["Stn"]["name"] + "</p> <p>" + parsed[x]["Journey"]['distance'] + " meters</p><hr>");
                }
                else if (parsed[x]['mode'] == 5) {
                    document.getElementById('panel').insertAdjacentHTML('beforeend',
                        "<img src='../static/img/bus.png' style='width:32px;height:32px';>" +
                        "<p>Take bus number " + parsed[x]["Dep"]["Transport"]["name"] +
                        " toward " + parsed[x]["Dep"]["Transport"]["dir"] + " from station " +
                        parsed[x]["Dep"]["Stn"]["name"] + " to station " + parsed[x]["Arr"]["Stn"]["name"] +
                        "</p><p>" + parsed[x]["Journey"]['Stop'].length + " stops</p><hr>");
                    for (var z = 0; z < parsed[x]["Journey"]["Stop"].length; z++) {
                        var latitude = parsed[x]["Journey"]["Stop"][z]["Stn"]["y"];
                        var longitude = parsed[x]["Journey"]["Stop"][z]["Stn"]["x"];
                        var name = parsed[x]["Journey"]["Stop"][z]["Stn"]['name'];
                        latitude = parseFloat(latitude);
                        longitude = parseFloat(longitude);
                        locations.push({lat: latitude, lng: longitude, name: name});
                    }
                    for (var a = 0; a < locations.length; a++) {
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[a].lat, locations[a].lng),
                            map: map
                        });
                        markers.push(marker);
                        google.maps.event.addListener(marker, 'click', (function (marker, a) {
                            return function () {
                                infowindow.setContent(locations[a].name);
                                infowindow.open(map, marker);
                            }
                        })(marker, a));
                    }
                    if (x == parsed.length - 1) {
                        document.getElementById('panel').insertAdjacentHTML('beforeend',
                            "<button class='btn btn-primary' " +
                            "type='submit' onclick = 'removeLine(); deleteMarkers();getLatLng()'>Return to Results</button>");
                    }
                }
                else if (parsed[x]["mode"] == 20 && x == parsed.length - 1) {
                    var geocoder = new google.maps.Geocoder;
                    var lat = parsed[x]["Arr"]["Addr"]["y"];
                    var long = parsed[x]["Arr"]["Addr"]["x"];
                    var latlngStr = lat.toString() + "," + long.toString();
                    latlngStr = latlngStr.split(',', 2);
                    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
                    geocoder.geocode({'location': latlng}, function (results, status) {
                        if (status === 'OK') {
                            document.getElementById('panel').insertAdjacentHTML('beforeend',
                                "<img src='../static/img/walk.png' style='width:32px;height:32px';>" +
                                "<p>Walk to destination: " + results[0].formatted_address + "</p>");
                            document.getElementById('panel').insertAdjacentHTML('beforeend',
                                "<button class='btn btn-primary' " +
                                "type='submit' onclick = 'removeLine(); deleteMarkers();getLatLng()'>Return to Results</button>")

                        }
                    })
                }
            }
            busPath = new google.maps.Polyline({
                path: locations,
                geodesic: true,
                strokeColor: '#1e2dff',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            busPath.setMap(map);
        }
    }
}