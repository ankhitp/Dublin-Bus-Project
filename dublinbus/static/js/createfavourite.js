document.getElementById("addfavourite").addEventListener("click", function () {
    document.getElementById("favourite-Add").style.display = "block";
    document.getElementById("favourite-Input").style.display = "none";
    document.getElementById("one-holder").style.display = "block";

    var origin = document.getElementById("origin-input").value;
    var destination = document.getElementById("destination-input").value;


    // document.getElementById("one-holder").innerHTML=
    // "<div class=\"flex-container\">"+
    //       "<div id=\"flex1div\"> <b>From: </b>" + origin + "<b> To: </b>" + destination +
    //       "</div><div id=\"flex2div\"><button type=\"button\" class=\"btn btn-primary\" id=\"planJourney\">Plan Journey</button>"+
    //       "</div>"+
    //    "</div>";

    document.getElementById('one-holder').insertAdjacentHTML('beforeend',
        "<div class=\"flex-container\" id='" + startLoc + endLoc + "'>" +
        "<div id=\"flex1div\"> <b>From: </b>" + startLoc + "<b> To: </b>" + endLoc +
        "</div><div id=\"flex2div\" style=\"margin-left: 3%;\"><img src=\"../static/img/place.png\" style=\"height: 35px; width: 35px\"; value='" + startLoc + "|" + endLoc + "' id=\"planJourney\" onclick=\"getFavRoute('" + startLoc + "','" + endLoc + "')\">" + "&nbsp" + "&nbsp" + "&nbsp" +
        "<img src=\"../static/img/like.png\" style=\"height: 35px; width: 35px; id=\"delete\" onclick=\"removeFav('" + startLoc + "','" + endLoc + "')\">" +
        "</div>" +
        "</div>");

    document.getElementById('origin-input').value = '';
    document.getElementById('destination-input').value = '';


});

