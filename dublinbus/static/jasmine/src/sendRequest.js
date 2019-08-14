<<<<<<< HEAD
function sendRequest(url, start, end) {
    var url = url;
    var start = start;
    var end = end;
=======
// function sendRequest(url, start, end) {
//     var url = url;
//     var start = start;
//     var end = end;
//     var xhttp = new XMLHttpRequest();
//     xhttp.open("GET", url, true);
//     xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
//     //xhttp.setRequestHeader('X-CSRF-Token', 'abcdef');
//     xhttp.send();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState === 4 && this.status === 200) {
//             console.log(url);
//             //parsing this awful JSON. follow the url if you want to see how the JSON looks
//             var returnData = JSON.parse(this.responseText);
//             var parseMe = returnData['Res']['Connections']["Connection"];
//             printResults(parseMe, url, start, end);

//         }
//     }
// }

function sendRequest(startLat, startLong, destLat, destLong, date) {
    var transitData = 0;
    var xhttp = new XMLHttpRequest();
    var date = new Date();
    date = date.toISOString();
    var url = "http://transit.api.here.com/v3/route.json?app_id=tL7r9QKJ3KlE5Kc9LGYo&app_code=1arMc" +
        "SHt_o31xFSeBRswsA&modes=bus&routing=all&dep=" + startLat + "," + startLong + "&arr=" + destLat +
        "," + destLong + "&time=" + date;
    // console.log(url)
>>>>>>> 429636a666b98d06d28501e42011cc34296a4b10
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    //xhttp.setRequestHeader('X-CSRF-Token', 'abcdef');
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var transitData = parseData(JSON.parse(this.responseText));
            console.log("transitdata", transitData)
        }
    }
    console.log('send request returns:', transitData)
    return transitData;
}


function parseData(returnData) {
    var parseMe = returnData
    // ['Res']['Connections']["Connection"];
    if (parseMe.hasOwnProperty('Res')){
        var seven = 15;
    }
    console.log('seven', seven)
return(seven);
}
