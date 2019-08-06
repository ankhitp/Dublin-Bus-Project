/**
 * This function does a few things. First, we loop through all the sections of the route selected (walking, bus). If the
 * section is a bus section, all the stops are looped through and counted so we can tell the user how many stops there
 * are, and we also collect the latitudes and longitudes for each stop and add the markers for the map.
 *
 * @param i targets the specific route that the user wants to get directions for.
 * @param url for the API hit we want to do.
 * @param start the start position for the user
 * @param end the end position for the user
 */
function getRoute(i, url, start, end) {
    var checkFirst = true;
    var elem = document.getElementById("para" + i);
    if (elem) {
        elem.parentElement.removeChild(elem);
        checkFirst = false;
    }
    if (busPath !== undefined) {
        removeLine();
    }
    deleteMarkers();
    document.getElementById('directions').style.height = "700px";
    document.getElementById('directions').style.display = "block";
    start = start.replace("'", "\\'");
    var infowindow = new google.maps.InfoWindow();
    //array I'll use store locations
    var locations = [];
    var times = [];
    var km = 0;
    document.getElementById("directions").innerHTML = "<h3> Directions </h3>";
    //hit the HERE api for route
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //loop through each section of the route
            var returnData = JSON.parse(this.responseText);
            var parseMe = returnData['Res']['Connections']["Connection"];
            var parsed = parseMe[i]["Sections"]["Sec"];
            for (var x = 0; x < parsed.length; x++) {
                //if the direction is to walk and it's not the last step of the route
                if (parsed[x]["mode"] == 20 && x != parsed.length - 1) {
                    document.getElementById('directions').insertAdjacentHTML('beforeend',
                        "<img src='../static/img/walk.png' style='width:32px;height:32px';> <p>Walk to " +
                        parsed[x]["Arr"]["Stn"]["name"] + "</p> <p>" + parsed[x]["Journey"]['distance'] + " meters</p><hr>");
                }
                //if the direction is to take a bus
                else if (parsed[x]['mode'] == 5) {

                    //build the HTML for "take bus number X toward Z from station X to station Y. X stops"
                    document.getElementById('directions').insertAdjacentHTML('beforeend',
                        "<img src='../static/img/bus.png' style='width:32px;height:32px';>" +
                        "<p>Take bus number " + parsed[x]["Dep"]["Transport"]["name"] +
                        " toward " + parsed[x]["Dep"]["Transport"]["dir"] + " from station " +
                        parsed[x]["Dep"]["Stn"]["name"] + " to station " + parsed[x]["Arr"]["Stn"]["name"] +
                        "</p><p>" + parsed[x]["Journey"]['Stop'].length + " stops</p><hr>");
                    //go through all the stops and add the latitudes and longitudes to an array dictionary
                    for (var z = 0; z < parsed[x]["Journey"]["Stop"].length; z++) {
                        if (checkFirst) {
                            if (!elem) {
                                var stationTime = parsed[x]["Journey"]["Stop"][z]["dep"];
                                stationTime = new Date(stationTime);
                                var stationMin = stationTime.getMinutes();
                                var stationHours = stationTime.getHours();
                                document.getElementById(i.toString()).insertAdjacentHTML('beforeend', '<div class = "col-12" style = "text-align: center;" id = para' + i + '>The next bus is expected at ' + stationHours + ':' + stationMin + '</div>');
                                checkFirst = false;
                            } else {
                                continue;
                            }
                        }
                        var hold = parsed[x]["Journey"]["Stop"][z]["Stn"];
                        hold.longitude = parseFloat(hold.x);
                        hold.latitude = parseFloat(hold.y);
                        delete hold.x;
                        delete hold.y;
                        closest = closestLocation(hold, stopData)
                        if (z < parsed[x]["Journey"]["Stop"].length - 1) {
                            var nextLat = parsed[x]["Journey"]["Stop"][z + 1]["Stn"]["y"];
                            var nextLong = parsed[x]["Journey"]["Stop"][z + 1]["Stn"]["x"];
                            km += distance(closest.latitude, closest.longitude, nextLat, nextLong);
                        }
                        var time = parsed[x]["Journey"]["Stop"][z]["dep"];
                        var depArr = "depart";
                        if (time === undefined) {
                            time = parsed[x]["Journey"]["Stop"][z]["arr"];
                            depArr = "arrive";
                        }
                        time = new Date(time);
                        var minutes = time.getMinutes();
                        var hours = time.getHours();
                        var name = closest.stop_name;
                        var latitude = parseFloat(closest.latitude);
                        var longitude = parseFloat(closest.longitude);
                        locations.push({lat: latitude, lng: longitude, name: name, actual_stop_id: closest.actual_stop_id});
                        times.push({minutes: minutes, hours: hours})
                    }
                    var co2 = Math.round(km * 70);
                    var carCo2 = Math.round(km * 127);
                    var newCenter = new google.maps.LatLng(locations[0].lat, locations[0].lng);
                    var icon = {
                        url: '../static/img/iconsmarker1.png', // url
                        scaledSize: new google.maps.Size(40, 40), // scaled size
                        origin: new google.maps.Point(0, 0), // origin
                    };

                    map.panTo(newCenter);
                    //go through all the entries in our array and create markers from them, and then create
                    //onClick windows for each marker.
                    for (var a = 0; a < locations.length; a++) {
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[a].lat, locations[a].lng),
                            content: '<div id="content' + locations[a].actual_stop_id + '" >' + '<div id=stop' + locations[a].actual_stop_id + '>' + '<p><b>Stop ID:</b>  ' + locations[a].actual_stop_id + '</p>' +
                                '<p><b>Stop name:</b><br>' + locations[a].name + '</p><br>' + '<p><b>Serving route:</b>' + '**</p>' + '</div>'
                                + '<button id="realtime" onclick="get_real_time_data(' + locations[a].actual_stop_id + ')">View real time info</a></button>',
                            map: map,
                            icon: icon
                        });
                        markers.push(marker);
                        google.maps.event.addListener(marker, 'click', (function (marker, a) {
                            return function () {
                                infowindow.setContent('<div class="infowin">' + this.content + '</div>');
                                infowindow.open(map, marker);
                            }
                        })(marker, a));
                    }
                    //if its the last direction in the route, add a return to results button.
                    if (x == parsed.length - 1) {
                        document.getElementById('directions').insertAdjacentHTML('beforeend',
                            "<button class='btn btn-primary' " +
                            'type="submit" onclick = "removeLine(); deleteMarkers();getLatLng(\'' + start + '\',\'' + end + '\')">Return to Results</button>' +
                            '<br><h4>This bus route will result in ' + co2 + ' grams of CO2 being released into the atmosphere. <br>' +
                            'This is compared to ' + carCo2 + ' grams of CO2 if you had used a car!</h4>'
                        );
                    }
                }
                //if its the last step in the route and it's a walking instruction.
                else if (parsed[x]["mode"] == 20 && x == parsed.length - 1) {
                    //use the geocoder to get an address from a latitude and longitude (HERE api only gives us lat and long
                    //so we need to transform that back to an address to present to the user. All this logic here is just
                    //getting it in the right format for the Google Geocoder service.
                    var geocoder = new google.maps.Geocoder;
                    var lat = parsed[x]["Arr"]["Addr"]["y"];
                    var long = parsed[x]["Arr"]["Addr"]["x"];
                    var latlngStr = lat.toString() + "," + long.toString();
                    latlngStr = latlngStr.split(',', 2);
                    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
                    geocoder.geocode({'location': latlng}, function (results, status) {
                        if (status === 'OK') {
                            //Just building the html to say "walk to destination X" and add return to results button.
                            document.getElementById('directions').insertAdjacentHTML('beforeend',
                                "<img src='../static/img/walk.png' style='width:32px;height:32px';>" +
                                "<p>Walk to destination: " + results[0].formatted_address + "</p>");
                            document.getElementById('coTwo').innerHTML = 'This bus route will result in ' + '<b>' + co2 + '</b>' + ' grams of CO2 being released into the atmosphere. <br>' +
                                'This is compared to ' + '<b>' + carCo2 + '</b>' + ' grams of CO2 if you had used a car!';

                        }
                    })
                }
            }
            //building the line based on the locations of stops
            busPath = new google.maps.Polyline({
                path: locations,
                geodesic: true,
                strokeColor: 'black',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            var path = busPath.getPath();
            polylines.push(busPath);
            runSnapToRoad(path);

        }
    }
}


function closestLocation(targetLocation, locationData) {
    function vectorDistance(dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
    }

    function locationDistance(location1, location2) {
        var dx = location1.latitude - location2.latitude,
            dy = location1.longitude - location2.longitude;

        return vectorDistance(dx, dy);
    }

    return locationData.reduce(function (prev, curr) {
        var prevDistance = locationDistance(targetLocation, prev),
            currDistance = locationDistance(targetLocation, curr);
        return (prevDistance < currDistance) ? prev : curr;
    });
}