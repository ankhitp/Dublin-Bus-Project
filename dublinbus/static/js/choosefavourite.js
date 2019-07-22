// document.getElementById("planJourney").addEventListener("click", function(){
//     console.log("in choose favourite");




    // location.href = "www.yoursite.com";

//     console.log("in choose favourite");


  function chooseFavourite() {
    console.log("in choose favourite");
    thisval = document.getElementById("planJourney").value;
    console.log("thisval", thisval);
    var res = thisval.split("|");
    var start = res[0];
    var end = res[1];
    console.log("res", res);
    console.log("res 0", res[0]);
    console.log("res 1", res[1]);
    localStorage.setItem("storageName",start);


    changeMap(start,end);

    function changeMap(start, end) {
      window.location.href = "http://localhost:8000/journeyplan/"

      var saveditem = localStorage.getItem("storageName")
      console.log(saveditem)

      console.log("im on a new page")
        deleteMarkers();
        console.log("resizing map function")
        // var start = document.getElementById('origin-input').value;
        // var end = document.getElementById('destination-input').value;
        
        document.getElementById('options').style.padding="3%";
        // document.getElementById('options').style.height="26vh";
    
        document.getElementById('lowerholder').style.height="33vh";
    
    
        if (start == "" || end == "") {
            document.getElementById("options").innerHTML = "<h4 style = 'text-align: center'>Please enter a start and end location!</h4>" +
                "<div style = 'text-align: center'>" +
                "<br> <br> <button class='btn btn-primary' id = 'directionsButton'  type='submit' onclick = 'resetMap()'>Try Again</button> " +
                "</div>";
        } else {
            var columns_container = $(".dynamic-columns");
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





  
    }
  