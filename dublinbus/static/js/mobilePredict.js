function getPrediction(routeChosen, url, start, end, date, time) {
    var startStations = [];
    var endStations = [];
    var route = [];
    var times = [];
    var foundRoute = false;
    var realRoutes = ['68', '25B', '25A', '14', '77A', '39', '16', '40D', '27B',
        '142', '83', '130', '15', '46A', '33', '7', '39A', '49', '1',
        '123', '41', '67X', '9', '40', '84', '53',
        '151', '13', '15B', '65B', '29A', '61', '140', '79A', '38A',
        '31', '69', '44', '42', '67', '145',
        '32', '27A', '27X', '122', '54A', '66', '150', '56A',
        '37', '27', '15A', '65', '11', '47', '79', '83A', '4', '120',
        '41C', '70', '84A', '39X', '32X', '68A', '84X', '38',
        '33X', '26', '66A', '31A', '14C',
        '44B', '7A', '43', '25', '33A', '16C', '42D',
        '31B', '66X', '31D', '33D', '41B', '40B', '7D', '46E', '38D', '51D', '15D', '41A', '25D', '66B', '38B', '7B',
        '41X', '69X', '25X', '40E', '70D', '116', '77X',
        '33E', '41D'];
    var rushHr;
    var monToThursRushHr = 0;
    var friday = 0;
    var timesArray = ['7:00', '7:30', '8:00', '8:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
    for (var i = 0; i < timesArray.length; i++) {
        if (time === timesArray[i]) {
            console.log(timesArray[i]);
            console.log(time);
            rushHr = 1;
            break;
        } else {
            rushHr = 0;
        }
    }
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
            for (let x = 0; x < parsed.length; x++) {
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

                for (var r = 0; r < realRoutes.length; r++) {
                    if (busRoute === realRoutes[r]) {
                        foundRoute = true;
                        break;
                    }
                }
                if (foundRoute == true) {
                    console.log("Got ehre with bus route " + busRoute);
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
                } else {
                    for (let x = 0; x < parsed.length; x++) {
                        //mode == 5 means that it's a bus traveled method
                        if (parsed[x]['mode'] == 5) {
                            var tempStartTime = new Date(parsed[x]['Dep']['time']);
                            var tempEndTime = new Date(parsed[x]['Arr']['time']);
                        }
                    }
                    var timePassed = (tempEndTime - tempStartTime) / (1000 * 60);
                    processFunc(timePassed);
                }
            } else if (connections > 0) {
                var j = 0;
                function next() {
                    foundRoute = false;
                    if (j < startStations.length) {
                        endPoint = endStations[j].actual_stop_id;
                        busRoute = route[j].number;
                        startingStation = startStations[j].actual_stop_id;
                        for (var r = 0; r < realRoutes.length; r++) {
                            if (busRoute === realRoutes[r]) {
                                foundRoute = true;
                                break;
                            }
                        }
                        if (foundRoute == true) {
                            xhttp2 = new XMLHttpRequest();
                            xhttp2.open("POST", 'bus_prediction', true);
                            xhttp2.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                            xhttp2.send("route=" + busRoute + "&startingPoint=" + startingStation + "&endPoint=" + endPoint + "&dayOfWeek=" + dateObj + "&rushHour=" + rushHr + "&monThursRush=" + monToThursRushHr + "&friday=" + friday);
                            xhttp2.onreadystatechange = function () {
                                if (xhttp2.readyState === 4 && xhttp2.status === 200) {
                                    j++;
                                    multiTimeFunc(JSON.parse(xhttp2.responseText));
                                    next();
                                }
                            }
                        }
                        else {
                            let checkConnect = 0;
                            for (let x = 0; x < parsed.length; x++) {
                                //mode == 5 means that it's a bus traveled method
                                if (parsed[x]['mode'] == 5) {
                                    if (checkConnect === j) {
                                        var tempStartTime = new Date(parsed[x]['Dep']['time']);
                                        var tempEndTime = new Date(parsed[x]['Arr']['time']);
                                        var timePassed = (tempEndTime - tempStartTime) / (1000 * 60);
                                        multiTimeFunc(timePassed);
                                        break;
                                    }
                                    checkConnect++;
                                }
                            }
                            j++;
                            next();
                        }
                    }
                }
                next();
            }
        }
    };

    function processFunc(content) {
        content = Math.floor(content);
        document.getElementById('time' + routeChosen).innerHTML = content + " minutes";
    }

    function multiTimeFunc(content) {
        var timeToPred = 0;
        times.push(content);
        if (times.length == startStations.length) {
            for (var a = 0; a < times.length; a++) {
                timeToPred += times[a];
            }
            timeToPred = Math.floor(timeToPred);
            document.getElementById('time' + routeChosen).innerHTML = timeToPred + " minutes";
        }
    }
}

