document.getElementById("addfavourite").addEventListener("click", function(){
    document.getElementById("favourite-Add").style.display = "block";
    document.getElementById("favourite-Input").style.display = "none";
    document.getElementById("one-holder").style.display = "block";
    console.log("ran one");

    var origin = document.getElementById("origin-input").value;
    var destination = document.getElementById("destination-input").value;
    console.log(origin, destination);
    console.log("ran two");

    document.getElementById("one-holder").innerHTML=
    "<div class=\"flex-container\">"+
          "<div id=\"flex1div\"> <b>From: </b>" + origin + "<b> To: </b>" + destination +
          "</div><div id=\"flex2div\"><button type=\"button\" class=\"btn btn-primary\" id=\"planJourney\">Plan Journey</button>"+
          "</div>"+
       "</div>";

    

  });
