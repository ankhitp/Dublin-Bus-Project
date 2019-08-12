function getPrediction(routeChosen, url, start, end, date, time) {
    var startStations = [];
    var endStations = [];
    var route = [];
    var times = [];
    var rushHr;
    var monToThursRushHr = 0;
    var friday = 0;
    var timesArray = ['7:00am', '7:30am', '8:00am', '8:30am', '4:00pm', '4:30pm', '5:00pm', '5:30pm', '6:00pm'];
    for (var i = 0; i < timesArray.length; i++) {
        if (time === timesArray[i]) {
            rushHr = 1;
            break;
        } else {
            rushHr = 0;
        }
    }
    console.log(date);
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
            var connections = parseMe[routeChosen]['transfers'];
            var parsed = parseMe[routeChosen]["Sections"]["Sec"];
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
                    var hold2 = parsed[x]["Arr"]["Stn"];
                    hold2.longitude = parseFloat(hold2.x);
                    hold2.latitude = parseFloat(hold2.y);
                    delete hold2.x;
                    delete hold2.y;
                    var endStop = closestLocation(hold2, stopData);
                    endStations.push({actual_stop_id: endStop.actual_stop_id});
                    route.push({number: parsed[x]["Dep"]["Transport"]['name']});
                }
            }
            if (connections == 0) {
                var endPoint = endStations[0].actual_stop_id;
                var startingStation = startStations[0].actual_stop_id;
                var busRoute = route[0].number;
                myXhttp = new XMLHttpRequest();
                myXhttp.open("POST", 'bus_prediction', true);
                console.log("route=" + busRoute + "&startingPoint=" + startingStation + "&endPoint=" + endPoint + "&dayOfWeek=" + dateObj + "&rushHour=" + rushHr + "&monThursRush=" + monToThursRushHr + "&friday=" + friday);
                myXhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                myXhttp.send("route=" + busRoute + "&startingPoint=" + startingStation + "&endPoint=" + endPoint + "&dayOfWeek=" + dateObj + "&rushHour=" + rushHr + "&monThursRush=" + monToThursRushHr + "&friday=" + friday);
                myXhttp.onreadystatechange = function () {
                    if (myXhttp.readyState === 4 && myXhttp.status === 200) {
                        processFunc(JSON.parse(myXhttp.responseText));
                    }
                }
            } else if (connections > 0) {
                var j = 0;
                function next() {
                    if (j < startStations.length) {
                        endPoint = endStations[j].actual_stop_id;
                        busRoute = route[j].number;
                        console.log("Busroute is " + busRoute);
                        startingStation = startStations[j].actual_stop_id;
                        xhttp2 = new XMLHttpRequest();
                        xhttp2.open("POST", 'bus_prediction', true);
                        xhttp2.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                        xhttp2.send("route=" + busRoute + "&startingPoint=" + startingStation + "&endPoint=" + endPoint + "&dayOfWeek=" + dateObj + "&rushHour=" + rushHr + "&monThursRush=" + monToThursRushHr + "&friday=" + friday);
                        xhttp2.onreadystatechange = function () {
                            if (xhttp2.readyState === 4 && xhttp2.status === 200) {
                                j++;
                                multiTimeFunc(JSON.parse(myXhttp.responseText));
                                next();
                            }
                        }
                    }
                }
                next();
            }
        }
    };
    function processFunc(content) {
        content = Math.floor(content);
        document.getElementById('time'+routeChosen).innerHTML=content + " minutes";
    }

    function multiTimeFunc(content) {
        var timeToPred = 0;
        times.push(content);
        if (times.length == startStations.length) {
            for (var a = 0; a < times.length; a++) {
                timeToPred += times[a];
            }
            timeToPred = Math.floor(timeToPred);
            document.getElementById('time'+routeChosen).innerHTML=timeToPred + " minutes";
        }
    }
}

