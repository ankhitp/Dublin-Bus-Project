function sendRequest(url, start, end) {
    var url = url;
    var start = start;
    var end = end;
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    //xhttp.setRequestHeader('X-CSRF-Token', 'abcdef');
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            console.log(url);
            //parsing this awful JSON. follow the url if you want to see how the JSON looks
            var returnData = JSON.parse(this.responseText);
            var parseMe = returnData['Res']['Connections']["Connection"];
            printResults(parseMe, url, start, end);

        }
    }
}



