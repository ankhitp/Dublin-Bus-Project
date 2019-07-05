function addMarker(map, data) {
    //get the stop data from JSON file
    //this line in js cannot get the JSON, but when it in html, it can get
    // var data = {{ load | safe}};
    var infowindow = new google.maps.InfoWindow({});

    for (var i = 0, length = data.length; i < length; i++) {
        var busdata = data[i];
        // {#Console.log(busdata);#}
        var myLatLng = {lat: parseFloat(busdata.stop_lat), lng: parseFloat(busdata.stop_lon)};

        // Creating  markers and putting it on the map

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: busdata.actual_stop_id + "\n" + busdata.stop_name,
            content: '<div id="content">' + '<div id="Stop_id">' + '<p><b>Stop ID:</b>  ' + busdata.actual_stop_id + '</p>' +
                '<p><b>Stop name:</b><br>' + busdata.stop_name + '</p><br>' + '<p><b>Serving route:</b>' + '**</p>' + '</div>'
                + '<button id="realtime"><a href="../realtimeinfo/' + busdata.actual_stop_id + '"> View real time info</button></div>'

        });


        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(this.content);
            infowindow.open(map, this);
        });
        marker.setMap(map)
    }
}