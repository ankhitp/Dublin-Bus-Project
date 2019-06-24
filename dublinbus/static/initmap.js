// Initialize and add the map
function initMap() {
    // The location of Uluru
    var dublin = {lat: 53.33306, lng: -6.24889};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 14, center: dublin});
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({position: dublin, map: map});
  }