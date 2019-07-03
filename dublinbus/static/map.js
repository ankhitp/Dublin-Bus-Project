function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    // The location of Dublin
    var dublin = {lat: 53.33306, lng: -6.24889};
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: dublin,
        mapTypeControl: false,
    });
    directionsDisplay.setMap(map);
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
    // The marker, positioned at Uluru
    addMarker(map);

}

function addMarker(map) {
    for (var i = 0, length = data.length; i < length; i++) {
        var busdata = data[i];
        // {#Console.log(busdata);#}
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

//sets the map back to original position, this will be changed when I move the directions over to the left panel
function resetMap() {
    var columns_container = $(".dynamic-columns");
    document.getElementById('panel').style = 'display:none';
    document.getElementById('options').style = "display:block";

    $(".dynamic-columns .col:nth-child(2)").removeClass("col-9");
    $(".dynamic-columns .col:nth-child(2)").addClass("col-10");

    $(".dynamic-columns .col:last-child").removeClass("col-3");
    $(".dynamic-columns .col:last-child").addClass("col-0");
    columns_container.toggleClass("expanded");
}

//resizes map for directions on the right side, this will be changed when I move the directions over to the left panel

function resizeMap() {
    console.log("here");
    var columns_container = $(".dynamic-columns");
    if (!columns_container.hasClass("expanded")) {
        document.getElementById('options').style = "display:none";

        $(".dynamic-columns .col:nth-child(2)").removeClass("col-10");
        $(".dynamic-columns .col:nth-child(2)").addClass("col-9");

        $(".dynamic-columns .col:last-child").removeClass("col-0");
        $(".dynamic-columns .col:last-child").addClass("col-3");
        columns_container.toggleClass("expanded");
    }
    document.getElementById('panel').style = 'display:block; overflow:scroll; max-height: 800px';
    getLatLng();
}
