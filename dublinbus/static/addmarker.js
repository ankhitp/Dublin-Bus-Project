// function addMarker(map) {
//     for (var i = 0, length = data.length; i < length; i++) {
//         var busdata = data[i];
//         // {#Console.log(busdata);#}
//         var myLatLng = {lat: parseFloat(busdata.stop_lat), lng: parseFloat(busdata.stop_lon)};
//
//         // Creating  markers and putting it on the map
//
//         // {#var image = 'https://image.flaticon.com/icons/svg/164/164955.svg';#}
//         // {#var image = "{% static '../../static/img/bus.png' %}";#}
//         var marker = new google.maps.Marker({
//             position: myLatLng,
//             map: map,
//             title: busdata.actual_stop_id + "\n" + busdata.stop_name,
//             // {#icon: image,#}
//
//         });
//
//     }
// }

function addMarker(map, data) {
            //get the stop data from JSON file
            //this line in js cannot get the JSON, but when it in html, it can get
            // var data = {{ load | safe}};

            for (var i = 0, length = data.length; i < length; i++) {
                var busdata = data[i];
                // {#Console.log(busdata);#}
                var myLatLng = {lat: parseFloat(busdata.stop_lat), lng: parseFloat(busdata.stop_lon)};

                // Creating  markers and putting it on the map

                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    title: busdata.actual_stop_id + "\n" + busdata.stop_name,

                });
                marker.info = new google.maps.InfoWindow({
                    content: '<div id="content">' + '<div id="Stop_nid">' + '<p><b>Stop ID:</b>  ' + busdata.actual_stop_id + '</p>' +
                        '<p><b>Stop name:</b><br>' + busdata.stop_name + '</p><br>' +
                        '<div>' +
                        '<p><b>Serving route:</b>' + '**</p>' + '</div>'
                        + '<button id="realtime">View real time info</button>' +
                        '</div>'
                });
                google.maps.event.addListener(marker, 'click', function () {
                    this.info.open(map, this);
                });
            }
        }