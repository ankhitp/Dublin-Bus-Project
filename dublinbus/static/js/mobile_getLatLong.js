/**
 * The getLatLng() function is the first one called in the setting up of the directions window. The function gets the start
 * and end points off of the input boxes, and then calls the Google Geocode Service to get latitude and longitudes for each
 * spot. From there, it calls the HERE Transit API, which will provide a list of routes and directions between the
 * two latitude and longitude points. The function then tells the user which bus lines are possible between two points
 * and also indicates how many connections each route has.
 */
function getLatLng() {
    document.getElementById("mypanel").innerHTML = "<h3>Possible Routes</h3>";
    var start = document.getElementById('origin-input').value;
    var end = document.getElementById('destination-input').value;
    var geocoder = new google.maps.Geocoder();
    var geocoder2 = new google.maps.Geocoder();
    console.log("made it to here");
    geocoder.geocode({'address': start}, function (results, status) {
            if (status == 'OK') {
                var loc = results[0].geometry.location;
                startLat = loc.lat();
                startLong = loc.lng();
            }
            geocoder2.geocode({'address': end}, function (results, status) {
                if (status == 'OK') {
                    var loc = results[0].geometry.location;
                    destLat = loc.lat();
                    destLong = loc.lng();
                    xhttp = new XMLHttpRequest();
                    var date = new Date();
                    date = date.toISOString();
                    var url = "http://transit.api.here.com/v3/route.json?app_id=tL7r9QKJ3KlE5Kc9LGYo&app_code=1arMc" +
                        "SHt_o31xFSeBRswsA&modes=bus&routing=all&dep=" + startLat + "," + startLong + "&arr=" + destLat +
                        "," + destLong + "&time=" + date;
                    console.log("test");
                    console.log(url);
                    xhttp.open("GET", url, true);
                    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                    //xhttp.setRequestHeader('X-CSRF-Token', 'abcdef');
                    xhttp.send();
                    xhttp.onreadystatechange = function () {
                        if (this.readyState === 4 && this.status === 200) {
                            var returnData = JSON.parse(this.responseText);
                            var parseMe = returnData['Res']['Connections']["Connection"];
                            for (var i = 0; i < parseMe.length; i++) {
                                var parsed = parseMe[i]["Sections"]["Sec"];
                                var connections = 0;
                                for (var x = 0; x < parsed.length; x++) {
                                    if (parsed[x]['mode'] == 5) {
                                        connections++;
                                        if (connections == 1) {
                                            console.log(x);
                                            var hold = parsed[x]['Dep']['Transport']['name'] + ' toward ' +
                                                parsed[x]['Dep']['Transport']['dir'];
                                            document.getElementById('mypanel').insertAdjacentHTML('beforeend',
                                                '<button id =' + i + ' class="btn btn-primary" type="submit" ' +
                                                'onclick = "getRoute(' + i + ', \'' + url + '\')"></button>');
                                            document.getElementById(i).innerHTML = hold;
                                            depTime = new Date(parsed[x]["Dep"]['time']);
                                            arrTime = new Date(parsed[x]["Arr"]['time']);
                                        }
                                    }
                                }

                                var diff = arrTime - depTime;
                                var string;
                                if (diff > 60e3) {
                                    string = Math.floor(diff / 60e3) + ' minutes';
                                }
                                else {
                                    string = Math.floor(diff / 1e3) + ' seconds';
                                }
                                if (connections == 1) {
                                    document.getElementById('mypanel').insertAdjacentHTML('beforeend', " (No connections) " +
                                        "- "+ string +" </p>");
                                } else if (connections > 1) {
                                    document.getElementById('mypanel').insertAdjacentHTML('beforeend', " (" + connections
                                        + " connections) - "+ string +"</p>");
                                }
                            }
                            document.getElementById('mypanel').insertAdjacentHTML('beforeend', "<button class=" +
                                "'btn btn-primary' type='submit' onclick = 'resetMap()'>Search Again</button>");
                        }
                    }
                }
            });
        }
    )
}