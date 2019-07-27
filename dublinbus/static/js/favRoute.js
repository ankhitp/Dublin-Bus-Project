// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function getFavRoute(start, end) {
    window.location.href = '/journeyplan?start='+start+'&end='+end;

   // xhttp = new XMLHttpRequest();
   // xhttp.open("POST", '/journeyplan/getFavRoute/', true);
   // xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
   // xhttp.setRequestHeader('x-csrf-token', csrftoken);
   // xhttp.send("start="+start+"&end="+end);
}