/**
 * This function does a few things. First, we loop through all the sections of the route selected (walking, bus). If the
 * section is a bus section, all the stops are looped through and counted so we can tell the user how many stops there
 * are, and we also collect the latitudes and longitudes for each stop and add the markers for the map.
 *
 * @param i targets the specific route that the user wants to get directions for.
 * @param url for the API hit we want to do.
 */
function getRoute(i, url, start, end) {
    console.log(url);
    var infowindow = new google.maps.InfoWindow();
    //array I'll use store locations
    var locations = [];
    var times = [];
    document.getElementById("options").innerHTML = "<h3> Directions </h3>";
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
                    document.getElementById('options').insertAdjacentHTML('beforeend',
                        "<img src='../static/img/walk.png' style='width:32px;height:32px';> <p>Walk to " +
                        parsed[x]["Arr"]["Stn"]["name"] + "</p> <p>" + parsed[x]["Journey"]['distance'] + " meters</p><hr>");
                }
                //if the direction is to take a bus
                else if (parsed[x]['mode'] == 5) {
                    //build the HTML for "take bus number X toward Z from station X to station Y. X stops"
                    document.getElementById('options').insertAdjacentHTML('beforeend',
                        "<img src='../static/img/bus.png' style='width:32px;height:32px';>" +
                        "<p>Take bus number " + parsed[x]["Dep"]["Transport"]["name"] +
                        " toward " + parsed[x]["Dep"]["Transport"]["dir"] + " from station " +
                        parsed[x]["Dep"]["Stn"]["name"] + " to station " + parsed[x]["Arr"]["Stn"]["name"] +
                        "</p><p>" + parsed[x]["Journey"]['Stop'].length + " stops</p><hr>");
                    //go through all the stops and add the latitudes and longitudes to an array dictionary
                    for (var z = 0; z < parsed[x]["Journey"]["Stop"].length; z++) {
                        var latitude = parsed[x]["Journey"]["Stop"][z]["Stn"]["y"];
                        var longitude = parsed[x]["Journey"]["Stop"][z]["Stn"]["x"];
                        var name = parsed[x]["Journey"]["Stop"][z]["Stn"]['name'];
                        var time = parsed[x]["Journey"]["Stop"][z]["dep"];
                        console.log(time);
                        var depArr = "depart";
                        if (time === undefined) {
                            time = parsed[x]["Journey"]["Stop"][z]["arr"];
                            depArr = "arrive";
                        }
                        time = new Date(time);
                        var minutes = time.getMinutes();
                        var hours = time.getHours();
                        latitude = parseFloat(latitude);
                        longitude = parseFloat(longitude);
                        locations.push({lat: latitude, lng: longitude, name: name});
                        times.push({minutes: minutes, hours: hours})
                    }
                    var newCenter = new google.maps.LatLng(locations[0].lat, locations[0].lng);
                    map.panTo(newCenter);
                    //go through all the entries in our array and create markers from them, and then create
                    //onClick windows for each marker.
                    for (var a = 0; a < locations.length; a++) {
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[a].lat, locations[a].lng),
                            map: map
                        });
                        markers.push(marker);
                        google.maps.event.addListener(marker, 'click', (function (marker, a) {
                            return function () {
                                infowindow.setContent(locations[a].name + " station." + "<br> The bus will " + depArr + " here at: " + times[a].hours + ":" + times[a].minutes);
                                infowindow.open(map, marker);
                            }
                        })(marker, a));
                    }
                    //if its the last direction in the route, add a return to results button.
                    if (x == parsed.length - 1) {
                        document.getElementById('options').insertAdjacentHTML('beforeend',
                            "<button class='btn btn-primary' " +
                            'type="submit" onclick = "removeLine(); deleteMarkers();getLatLng(\'' + start + '\',\'' + end + '\')">Return to Results</button>');
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
                            document.getElementById('options').insertAdjacentHTML('beforeend',
                                "<img src='../static/img/walk.png' style='width:32px;height:32px';>" +
                                "<p>Walk to destination: " + results[0].formatted_address + "</p>");
                            document.getElementById('options').insertAdjacentHTML('beforeend',
                                "<button class='btn btn-primary' " +
                                'type="submit" onclick = "removeLine(); deleteMarkers();getLatLng(\'' + start + '\',\'' + end + '\')">Return to Results</button>');

                        }
                    })
                }
            }
            //building the line based on the locations of stops
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