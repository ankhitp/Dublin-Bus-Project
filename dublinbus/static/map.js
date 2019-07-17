function initMap() {
    var infowindow = new google.maps.InfoWindow();
    var pos;
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

        // The location of Dublin
    var dublin = {lat: 53.33306, lng: -6.24889};
    // The map, centered at Uluru
    var im = 'http://www.robotwoods.com/dev/misc/bluecircle.png';
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: dublin,
        mapTypeControl: false,
    });
    directionsDisplay.setMap(map);
    //uses the Google geolocation service
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: im
            });
            map.setCenter(pos);
        });
    }
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        newMarkers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(142, 142),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(50, 50)
            };
            var location = document.getElementById("pac-input").value;
            myMark = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location,
                content: '<button onclick = "routeToHere(\'' + location + '\')" class = "btn-primary">Route to here</button></div>'
            });
            // Create a marker for each place.
            newMarkers.push(myMark);

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
            google.maps.event.addListener(myMark, 'click', (function (myMark) {
                return function () {
                    infowindow.setContent(myMark.content);
                    infowindow.open(map, myMark);
                }
            })(myMark));
        });
        map.fitBounds(bounds);

    });


    setAutocomplete();
    // The marker, positioned at Uluru
    addMarker(map);

}

//moved the setting up of the autocomplete boxes to another function
function setAutocomplete() {
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');

    //define a center and circle for our autocomplete search, this makes it so that it's biased toward this area when
    //searching for a place name
    var center = new google.maps.LatLng(53.33306,-6.24889);
    var circle = new google.maps.Circle({
        center: center,
        radius: 10000
    });
    //setting up the autcomplete and adding the bound circle of 10KM for suggestions
    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
    originAutocomplete.setBounds(circle.getBounds());
    destinationAutocomplete.setBounds(circle.getBounds());
    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
    var marker = new google.maps.Marker({position: dublin, map: map});
}

function addMarker(map) {
    for (var i = 0, length = data.length; i < length; i++) {
        var busdata = data[i];
        var myLatLng = {lat: parseFloat(busdata.stop_lat), lng: parseFloat(busdata.stop_lon)};

        // Creating  markers and putting it on the map

        // {#var image = 'https://image.flaticon.com/icons/svg/164/164955.svg';#}
        // {#var image = "{% static '../../static/img/bus.png' %}";#}
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: busdata.actual_stop_id + "\n" + busdata.stop_name,
            // {#icon: image,#}

        });

    }
}

function routeFromHere(data) {
    document.getElementById('origin-input').value = data;
}

function routeToHere(location) {
    var pos;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(pos);
            var geocoder = new google.maps.Geocoder;
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            var latlngStr = lat.toString() + "," + long.toString();
            latlngStr = latlngStr.split(',', 2);
            var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
            geocoder.geocode({'location': latlng}, function (results, status) {
                if (status === 'OK') {
                    var start = results[0].formatted_address;
                    getLatLng(start, location);
                }
                else {
                    alert("Something went wrong. Try again!")
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

//removes line created for route
function removeLine() {
    busPath.setMap(null);
}

function clearMarkers() {
    setMapOnAll(null);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

//CALL THIS TO REMOVE MARKERS FROM MAP, IT USES THE OTHER MARKER RELATED FUNCTIONS!
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

//sets the map back to original position
function resetMap() {
    var columns_container = $(".dynamic-columns");
    $(".dynamic-columns .col:first-child").removeClass("col-3");
    $(".dynamic-columns .col:first-child").addClass("col-2");

    $(".dynamic-columns .col:last-child").removeClass("col-9");
    $(".dynamic-columns .col:last-child").addClass("col-10");
    columns_container.toggleClass("expanded");
    document.getElementById('options').innerHTML =
        "<div>"+
            '<h3 style="text-align: center">Start your journey here!</h3>'+
            '<br>'+
            '<h4 style="text-align: center">Enter a start and end location!</h4>'+

            '<div style = "text-align: center">'+

        '<input autocomplete="off" id="origin-input" class="controls" type="text" placeholder="Enter an origin location">'+

        '<input autocomplete="off"   id="destination-input" class="controls" type="text" placeholder="Enter a destination location">'+

        '</div>'+
        '<br>'+
        '<div style = "text-align: center">'+
        '<button  class="btn btn-primary" id = "directionsButton"  type="submit" onclick = "resizeMap()">Search</button>'+
        '</div><br>'+
        '<div style = "text-align: center">' +
        '<button  class="btn btn-primary" id = "locationButton"  type="submit" onclick = "findLocation()">Find Stations Near Me!</button>' +
        '</div> </div>';
    setAutocomplete();


}

function hideSide(){
    document.getElementById('header').innerHTML="<p>Search for somewhere to go!</p>";
    var columns_container = $(".dynamic-columns");
    document.getElementById('options').style.height = "0px";
    $(".dynamic-columns .col:first-child").removeClass("col-2");
    $(".dynamic-columns .col:first-child").addClass("col-0");

    $(".dynamic-columns .col:last-child").removeClass("col-10");
    $(".dynamic-columns .col:last-child").addClass("col-12");
}

//resizes map for directions on the right side

function resizeMap() {
    deleteMarkers();
    var start = document.getElementById('origin-input').value;
    var end = document.getElementById('destination-input').value;

    if (start == "" || end == "") {
        document.getElementById("options").innerHTML = "<h4 style = 'text-align: center'>Please enter a start and end location!</h4>" +
            "<div style = 'text-align: center'>"+
            "<br> <br> <button class='btn btn-primary' id = 'directionsButton'  type='submit' onclick = 'resetMap()'>Try Again</button> " +
            "</div>";
    }
    else {var columns_container = $(".dynamic-columns");
        if (!columns_container.hasClass("expanded")) {

            $(".dynamic-columns .col:first-child").removeClass("col-2");
            $(".dynamic-columns .col:first-child").addClass("col-3");

            $(".dynamic-columns .col:last-child").removeClass("col-10");
            $(".dynamic-columns .col:last-child").addClass("col-9");

            columns_container.toggleClass("expanded");
        }
        getLatLng(start, end);
    }
}
