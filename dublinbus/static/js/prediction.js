function getPrediction(routeChosen, url, start, end, date, time) {
    console.log("inside get prediction")
    var startStations = [];
    var endStations = [];
    var route = [];
    var rushHr;
    var monToThursRushHr = 0;
    var friday = 0;
    var timesArray = ['7:00am', '7:30am', '8:00am', '8:30am', '4:00pm', '4:30pm', '5:00pm', '5:30pm', '6:00pm'];
    for (var i = 0; i < timesArray.length; i++) {
        if (time === timesArray[i]) {
            rushHr = 1;
        } else {
            rushHr = 0;
        }
    }
    if (rushHr == 1)
        var dateObj = new Date(date).getDay();
    dateObj = dateObj - 1;
    if (dateObj == -1) {
        dateObj = 6;
    }
    if (rushHr == 1 && dateObj < 4) {
        monToThursRushHr = 1;
    }
    if (dateObj == 4) {
        friday = 1;
    }
    xhttp4 = new XMLHttpRequest();
    xhttp4.open("GET", url, true);
    xhttp4.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    //xhttp.setRequestHeader('X-CSRF-Token', 'abcdef');
    xhttp4.send();
    xhttp4.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var returnData = JSON.parse(this.responseText);
            var parseMe = returnData['Res']['Connections']["Connection"];
            for (var i = 0; i < parseMe.length; i++) {
                var connections = parseMe[i]['transfers'];
                console.log(connections);
                var parsed = parseMe[i]["Sections"]["Sec"];
                for (var x = 0; x < parsed.length; x++) {
                    //mode == 5 means that it's a bus traveled method
                    if (parsed[x]['mode'] == 5) {
                        var hold = parsed[x]["Dep"]["Stn"];
                        hold.longitude = parseFloat(hold.x);
                        hold.latitude = parseFloat(hold.y);
                        delete hold.x;
                        delete hold.y;
                        var startStation = closestLocation(hold, stopData);
                        startStations.push({actual_stop_id: startStation.actual_stop_id});
                        var endStop = parsed[x]["Dep"]["Stn"];
                        endStop.longitude = parseFloat(endStop.x);
                        endStop.latitude = parseFloat(endStop.y);
                        delete endStop.x;
                        delete endStop.y;
                        endStop = closestLocation(endStop, stopData);
                        endStations.push({actual_stop_id: end.actual_stop_id});
                        route.push({number: parsed[x]["Dep"]["Transport"]['name']});
                    }
                }
                if (connections == 0) {
                    var endPoint = endStations[0].actual_stop_id;
                    var startingStation = startStations[0].actual_stop_id;
                    var busRoute = route[0].name;
                    xhttp2 = new XMLHttpRequest();
                    xhttp2.open("POST", 'bus_prediction', true);
                    xhttp2.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                    xhttp2.send("route=" + busRoute + "&startingPoint=" + startingStation + "&endPoint=" + endPoint + "&dayOfWeek=" + dateObj + "&rushHour" + rushHr + "&monThursRush=" + monToThursRushHr + "&friday=" + friday);
                } else if (connections > 0) {
                    for (var j = 0; j < startStations.length; j++) {
                        endPoint = endStations[j].actual_stop_id;
                        busRoute = route[j].name;
                        startingStation = startStations[j].actual_stop_id;
                        xhttp2 = new XMLHttpRequest();
                        xhttp2.open("POST", 'bus_prediction', true);
                        xhttp2.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                        xhttp2.send("route=" + busRoute + "&startingPoint=" + startingStation + "&endPoint=" + endPoint + "&dayOfWeek=" + dateObj + "&rushHour" + rushHr + "&monThursRush=" + monToThursRushHr + "&friday=" + friday);
                    }
                }
            }
        }
        //calculate time
        //let the user know how many connections required per route.
        getRoute(routeChosen, url, start, end);
    }
}