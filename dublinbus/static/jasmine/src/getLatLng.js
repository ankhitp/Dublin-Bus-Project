/**
 * The getLatLng() function is the first one called in the setting up of the directions window. The function gets the start
 * and end points off of the input boxes, and then calls the Google Geocode Service to get latitude and longitudes for each
 * spot. From there, it calls the HERE Transit API, which will provide a list of routes and directions between the
 * two latitude and longitude points. The function then tells the user which bus lines are possible between two points
 * and also indicates how many connections each route has.
 */
function setupLatLng(start, end) {
    document.getElementById('options').style.height = "26vh";
    document.getElementById('options').innerHTML = "<h3>Possible Routes</h3>";

    start = start.replace("'", "\\'");
    //set the HTML for the routes list
    //start and end points
    var dublin = {
        lat: 53.33306,
        lng: -6.24889
    };
    map.panTo(dublin);
    getLatLng(start, end)
}

function getLatLng(start, end) {
    //Two geocoders, one for the start and one for end
    var geocoder = new google.maps.Geocoder();
    var geocoder2 = new google.maps.Geocoder();
    var url = "";
    geocoder.geocode({
        'address': start
    }, function(results, status) {
        if (status == 'OK') {
            var loc = results[0].geometry.location;
            console.log("loc",loc);
            startLat = loc.lat();
            startLong = loc.lng();
        }
        geocoder2.geocode({
            'address': end
        }, function(results, status) {
            if (status == 'OK') {
                //locations are stored in a variable called results. results[0] is the most accurate one, the list
                //results get less accurate as you go down, so if you looked at results[1], it'll be less specific
                var loc = results[0].geometry.location;
                destLat = loc.lat();
                destLong = loc.lng();
                //new xhttp request to get the data from the HERE api
                xhttp = new XMLHttpRequest();
                var date = new Date();
                date = date.toISOString();
                url = "http://transit.api.here.com/v3/route.json?app_id=tL7r9QKJ3KlE5Kc9LGYo&app_code=1arMc" +
                    "SHt_o31xFSeBRswsA&modes=bus&routing=all&dep=" + startLat + "," + startLong + "&arr=" + destLat +
                    "," + destLong + "&time=" + date;
                console.log("hello",url, start, end)
                sendRequest(url, start, end);

            }
        })

    })
    return(geocoder, geocoder2);
}

