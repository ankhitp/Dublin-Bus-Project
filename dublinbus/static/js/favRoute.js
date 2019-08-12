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

function updateUserFav(user) {
    var origin = document.getElementById("origin-input").value;
    var destination = document.getElementById("destination-input").value;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/users/addFav/');
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhttp.setRequestHeader('X-CSRF-Token', csrftoken);
    xhttp.send("start=" + origin + "&end="+destination+"&user="+user);
    var returnData = this.responseText;
    if (returnData == 400) {
        alert("There was an error on the server side of things. Try again!")
    }
}

function removeFav(startLoc,endLoc) {
    console.log('jdfsakjldja',startLoc,endLoc);
    $.post("delete_fav/",{startLoc: startLoc,endLoc: endLoc}, function(data,status,){
        console.log(status);
        if (status == 'success'){
            document.getElementById(startLoc+endLoc).style.display="none";
        }
        else{
            alert("Something wrong :(")
        }
        })
}

function getFavRoute(start, end ) {
    window.location.href = '/journeyplan?start='+start+'&end='+end;

   // xhttp = new XMLHttpRequest();
   // xhttp.open("POST", '/journeyplan/getFavRoute/', true);
   // xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
   // xhttp.setRequestHeader('x-csrf-token', csrftoken);
   // xhttp.send("start="+start+"&end="+end);
}