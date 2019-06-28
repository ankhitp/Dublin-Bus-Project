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