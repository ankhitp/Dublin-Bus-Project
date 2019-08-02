/** This function does a few things. First, we loop through all the sections of the route selected (walking, bus). If the
/* section is a bus section, all the stops are looped through and counted so we can tell the user how many stops there
/* are, and we also collect the latitudes and longitudes for each stop and add the markers for the map.
/*
/* @param i targets the specific route that the user wants to get directions for.
/* @param url for the API hit we want to do.
/* @param start the start position for the user
/* @param end the end position for the user
*/
function getRoute(i, url, start, end) {
    document.getElementById('header').innerHTML="";
    document.getElementById('routes').innerHTML="";
    document.getElementById('map').style.display = "block";
    document.getElementById("options").style.height="auto";
    map.setZoom(12);
    if (busPath !== undefined) {
       removeLine();
   }
   deleteMarkers();
//    document.getElementById('directions').style.height = "700px";
//    document.getElementById('directions').style.display = "block";
    start = start.replace("&#39;", "");
    end = end.replace("&#39;", "");

    var infowindow = new google.maps.InfoWindow();
   //array I'll use store locations
   var locations = [];
   var times = [];
   var km = 0;
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
                var mycounter = convertNumberToWords(x+1);
                var CSScounter=mycounter.trim();
             
                

                if (parsed[x]["mode"] == 20 && x != parsed.length - 1) {
        

                    document.getElementById('options').insertAdjacentHTML('beforeend',


                        "<div class=\"row\">"+
                        // "<div class=\"col-12\" id=\"myholder\">"+
                                "<div id=\"accordion\"><div class=\"card\"><div class=\"card-header\" id=\"heading"+CSScounter+"-"+CSScounter+"\"><h5 class=\"mb-0\">"+
                                            "<button class=\"btn btn-link collapsed\" data-toggle=\"collapse\" data-target=\"#collapse"+CSScounter+"-"+CSScounter+"\"aria-expanded=\"false\" aria-controls=\"collapse"+CSScounter+"-"+CSScounter+"\">"+
                                            "<img src='../static/img/walk.png' style='width:32px;height:32px';>"+ " Walk travel"                                                +
                                  "</button>"+
                                "</h5>"+
                              "</div>"+
                          
                              "<div id=\"collapse"+CSScounter+"-"+CSScounter+"\"class=\"collapse\" aria-labelledby=\"heading"+CSScounter+"-"+CSScounter+"\"data-parent=\"#accordion\">"+
                                "<div class=\"card-body\">"+

                                "<img src='../static/img/walk.png' style='width:32px;height:32px';> <p>Walk to " +
                                parsed[x]["Arr"]["Stn"]["name"] + "</p> <p>" + parsed[x]["Journey"]['distance'] + " meters</p><hr>"+
                                "</div>"+
                             " </div>"+
                            "</div>"
                            );
                        }



                    
                        
                else if (parsed[x]['mode'] == 5) {
                    console.log(parsed[x]["Journey"]["Stop"].length)

                    
                    document.getElementById('options').insertAdjacentHTML('beforeend',


                        
                            
                        "<div class=\"row\">"+
                        // "<div class=\"col-12\" id=\"myholder\">"+
                                "<div id=\"accordion\"><div class=\"card\"><div class=\"card-header\" id=\"heading"+CSScounter+"-"+CSScounter+"div><h5 class=\"mb-0\">"+
                                            "<button class=\"btn btn-link collapsed\" data-toggle=\"collapse\" data-target=\"#collapse"+CSScounter+"-"+CSScounter+"\"aria-expanded=\"false\" aria-controls=\"collapse"+CSScounter+"-"+CSScounter+"\">"+
                                            "<img src='../static/img/bus.png' style='width:32px;height:32px'>"+ "  Take bus number "  + parsed[x]["Dep"]["Transport"]["name"]  +            
                                  "</button>"+
                                "</h5>"+
                              "</div>"+
                          
                              "<div id=\"collapse"+CSScounter+"-"+CSScounter+"\"class=\"collapse\" aria-labelledby=\"heading"+CSScounter+"-"+CSScounter+"\"data-parent=\"#accordion\">"+
                                "<div class=\"card-body\">"+

                        "<p>Take bus number " + parsed[x]["Dep"]["Transport"]["name"] +
                        " toward " + parsed[x]["Dep"]["Transport"]["dir"] + " from station " +
                        parsed[x]["Dep"]["Stn"]["name"] + " to station " + parsed[x]["Arr"]["Stn"]["name"] +
                        "</p><p>" + parsed[x]["Journey"]['Stop'].length + " stops</p>"+

                                "</div>"+
                             " </div>"+
                            "</div>"

        );

        for (var z = 0; z < parsed[x]["Journey"]["Stop"].length; z++) {
            var latitude = parsed[x]["Journey"]["Stop"][z]["Stn"]["y"];
            var longitude = parsed[x]["Journey"]["Stop"][z]["Stn"]["x"];
            if (z < parsed[x]["Journey"]["Stop"].length - 1) {
                var nextLat = parsed[x]["Journey"]["Stop"][z+1]["Stn"]["y"];
                var nextLong = parsed[x]["Journey"]["Stop"][z+1]["Stn"]["x"];
                km += distance(latitude, longitude, nextLat, nextLong);
            }
            var name = parsed[x]["Journey"]["Stop"][z]["Stn"]['name'];
            var time = parsed[x]["Journey"]["Stop"][z]["dep"];
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
        var co2 = Math.round(km * 70);
        var carCo2 = Math.round(km * 127);
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
                    infowindow.setContent(locations[a].name);
                    infowindow.open(map, marker);
                }
            })(marker, a));
        }
       //if its the last direction in the route, add a return to results button.
       if (x == parsed.length - 1) {
        document.getElementById('carbonholder').insertAdjacentHTML('beforeend',
            "<button class='btn btn-primary' " +
            'type="submit" onclick = "removeLine(); deleteMarkers();getLatLng()">Return to Results</button>' +
            '<br><h4>This bus route will result in '+co2+' grams of CO2 being released into the atmosphere. <br>' +
            'This is compared to ' + carCo2 + ' grams of CO2 if you had used a car!</h4>'
        );
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


                document.getElementById('options').insertAdjacentHTML('beforeend',
                 
                    
                    
                    
                    "<div class=\"row\">"+
                            "<div id=\"accordion\"><div class=\"card\"><div class=\"card-header\" id=\"heading"+CSScounter+"-"+CSScounter+"\"><h5 class=\"mb-0\">"+
                                        "<button class=\"btn btn-link collapsed\" data-toggle=\"collapse\" data-target=\"#collapse"+CSScounter+"-"+CSScounter+"\"aria-expanded=\"false\" aria-controls=\"collapse"+CSScounter+"-"+CSScounter+"\">"+
                                        "<img src='../static/img/walk.png' style='width:32px;height:32px';>"+ " Walk travel"                                                +
                              "</button>"+
                            "</h5>"+
                          "</div>"+
                      
                          "<div id=\"collapse"+CSScounter+"-"+CSScounter+"\"class=\"collapse\" aria-labelledby=\"heading"+CSScounter+"-"+CSScounter+"\"data-parent=\"#accordion\">"+
                            "<div class=\"card-body\">"+

                            "<img src='../static/img/walk.png' style='width:32px;height:32px';>"+
                            "<p>Walk to destination: " + results[0].formatted_address + "</p>"+

                            "</div>"+
                         " </div>"+
                        "</div>"
                    
                        // '<br><h4>This bus route will result in '+co2+' grams of CO2 being released into the atmosphere. <br>' +
                        // 'This is compared to ' + carCo2 + ' grams of CO2 if you had used a car!</h4>'
                    
                    
                    );


                document.getElementById('carbonholder').insertAdjacentHTML('beforeend',
                    "<button class='btn btn-primary' " +
                    "type='submit' onclick = 'removeLine(); deleteMarkers();mobileMapReturnHide();mobileGetLatLng(\""+start+"\",\""+end+"\")'>Return to Results</button>");
                    //'<br><h4>This bus route will result in '+co2+' grams of CO2 being released into the atmosphere. <br>' +
                    //'This is compared to ' + carCo2 + ' grams of CO2 if you had used a car!</h4>')

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