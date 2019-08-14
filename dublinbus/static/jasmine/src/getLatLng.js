/**
 * The getLatLng() function is the first one called in the setting up of the directions window. The function gets the start
 * and end points off of the input boxes, and then calls the Google Geocode Service to get latitude and longitudes for each
 * spot. From there, it calls the HERE Transit API, which will provide a list of routes and directions between the
 * two latitude and longitude points. The function then tells the user which bus lines are possible between two points
 * and also indicates how many connections each route has.
 */



function getLatLng(start, end) {
    var returnData = [];
    functionfive=0;
    var geocoder = new google.maps.Geocoder();
    var geocoder2 = new google.maps.Geocoder();
    var url = "";
    geocoder.geocode({
        'address': start
    }, function(results, status) {
        if (status == 'OK') {
            var loc = results[0].geometry.location;
            startLat = loc.lat();
            startLong = loc.lng();
        }
        geocoder2.geocode({
            'address': end
        }, function(results, status) {
            if (status == 'OK') {
                //locations are stored in a variable called results. results[0] is the most accurate one, the list
                //results get less accurate as you go down, so if you looked at results[1], it'll be less specific
                var loc = results[0].geometry.location;
                destLat = loc.lat();
                destLong = loc.lng();
                   //new xhttp request to get the data from the HERE api
                xhttp = new XMLHttpRequest();
                var date = new Date();
                date = date.toISOString();
                var url = "https://transit.api.here.com/v3/route.json?app_id=tL7r9QKJ3KlE5Kc9LGYo&app_code=1arMc" +
                    "SHt_o31xFSeBRswsA&modes=bus&routing=all&dep=" + startLat + "," + startLong + "&arr=" + destLat +
                    "," + destLong + "&time=" + date;
                xhttp.open("GET", url, true);
                xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                //xhttp.setRequestHeader('X-CSRF-Token', 'abcdef');
                xhttp.send();
                console.log("here i am");
                xhttp.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        //parsing this awful JSON. follow the url if you want to see how the JSON looks
                        var returnData = JSON.parse(this.responseText);
                        console.log(returnData)
                        printResults(returnData, url, start, end)
                        // if (returnData.hasOwnProperty('Res')){
                        //     functionreturn = returnData.Res;
                        //     console.log("Has res proprety:", returnData)
                        //     var a = printResults(returnData, url, start, end)
                        //     console.log("a",a)

                        //         }
                        //     else {
                        //         console.log("does not have res property")
                        //     }
                        
            }
                }

<<<<<<< HEAD
    })
    return(geocoder, geocoder2);
}
=======
>>>>>>> 429636a666b98d06d28501e42011cc34296a4b10

        }
    }
        )
    })
    return returnData;
    }