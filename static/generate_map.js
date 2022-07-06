var map = null;
var boxpolys = null;
var directions = null;
var routeBoxer = null;
var distance = null; // this value must be in km
var service = null;
var gmarkers = [];
var boxes = null;
var infowindow = new google.maps.InfoWindow();

function initialize() {
    // map is initialized to show the US
    var mapOptions = {
        center: new google.maps.LatLng(37.0902, -95.7129),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 4.2
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    service = new google.maps.places.PlacesService(map);

    routeBoxer = new RouteBoxer();

    directionService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map
    });

    // following lines allow for parameters to be read from URL
    var query = location.search.substring(1);

    // split at each "&" character to separate each parameter
    var pairs = query.split("&");
  
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf("=");
        var argname = pairs[i].substring(0, pos).toLowerCase();
        var value = pairs[i].substring(pos + 1).toLowerCase();

        // process parameters
        if (argname == "to") {
            document.getElementById('to').value = unescape(value);
        }
        if (argname == "from") {
            document.getElementById('from').value = unescape(value);
        }
        // if "submit=_____" is included in URL, run route function on page load
        if (argname == "submit") {
            route();
        }
    }
}

function route() {
    // clear previous route boxes
    clearBoxes();

    // clear previous marker
    clearMarkers();

    // this value determines how far away from the optimal route the gas stations can be
    // 0.2 miles in km
    distance = 0.160935 * 2;

    var request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    // make the directions request
    directionService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var routeLength = result.routes[0].legs[0].distance.value / 1609.3445;
          
            // if route length (origin to destination) is greater than 35 miles
            if (routeLength > 35) {
                let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('alert-modal')) // Returns a Bootstrap modal instance
                // show modal if route is longer than specified maximum length
                modal.show();
                return;
            }

            directionsRenderer.setDirections(result);

            // box around the overview path of the first route
            var path = result.routes[0].overview_path;          

            boxes = routeBoxer.box(path, distance);
            // alert(boxes.length);
            drawBoxes();
            findPlaces(0);
        } else {
            alert("Directions query failed: " + status);
        }
    });

    // change text underneath map element
    document.getElementById("map-footer").textContent = "Showing all gas stations within 0.2 miles of the optimal route from " + document.getElementById("from").value + " to " + document.getElementById("to").value;
}

// draw the array of boxes as polylines on the map
function drawBoxes() {
    boxpolys = new Array(boxes.length);

    for (var i = 0; i < boxes.length; i++) {
        boxpolys[i] = new google.maps.Rectangle({
            bounds: boxes[i],
            fillOpacity: 0,
            strokeOpacity: 1.0,
            strokeColor: '#000000',
            strokeWeight: 1,
            map: map
        });
    }
}


function findPlaces(searchIndex) {
    var type = "gas_station";
    var request = {
        bounds: boxes[searchIndex],
    };

    if (!!type && (type != "")) {
        if (type.indexOf(',') > 0)
            request.types = type.split(',');
        else
            request.types = [type];
    }

    service.nearbySearch(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) { 
            for (var i = 0, result; result = results[i]; i++) {
                var marker = createMarker(result);
            }
        } else {
            // this part is only reached when API is down
        }
        if (status != google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            searchIndex++;
            if (searchIndex < boxes.length)
                findPlaces(searchIndex);
        } else { // delay 1 second and try again
            setTimeout("findPlaces(" + searchIndex + ")", 1000);
        }
    });
}

// Clear boxes currently on the map
function clearBoxes() {
    if (boxpolys != null) {
        for (var i = 0; i < boxpolys.length; i++) {
            boxpolys[i].setMap(null);
        }
    }
    boxpolys = null;
}

function clearMarkers() {
    for (var i = 0; i < gmarkers.length; i++ ) {
        gmarkers[i].setMap(null);
    }
    gmarkers.length = 0;
}

function createMarker(place) {
    if (place.icon) {
        var image = new google.maps.MarkerImage(
            place.icon, new google.maps.Size(71, 71),
            new google.maps.Point(0, 0), new google.maps.Point(17, 34),
            new google.maps.Size(25, 25)
        );
    } else var image = {
        url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png",
        size: new google.maps.Size(7, 7),
        anchor: new google.maps.Point(3.5, 3.5)
    };

    var marker = new google.maps.Marker({
        map: map,
        icon: image,
        position: place.geometry.location
    });
    var request = {
        reference: place.reference
    };

    google.maps.event.addListener(marker, 'click', function() {
        service.getDetails(request, function(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var tempString = "https://maps.google.com/?ll=" + place.geometry.location.lat() + "," + place.geometry.location.lng()
                console.log(tempString);
                console.log(place.url);
                var contentStr = '<h5><a href=' + place.url + '>' + place.name + '</a></h5>' + place.formatted_address;
                if (!!place.formatted_phone_number) contentStr += '<br>' + place.formatted_phone_number;
                infowindow.setContent(contentStr);
                infowindow.open(map, marker);
            } else {
                var contentStr = "<h5>No Result, status=" + status + "</h5>";
                infowindow.setContent(contentStr);
                infowindow.open(map, marker);
            }
        });
    });

    gmarkers.push(marker);
    if (!place.name) place.name = "result " + gmarkers.length;
}

function routeURL(){	
    var fromInput  = document.getElementById('from').value;
    var toInput  = document.getElementById('to').value;
    window.location.href = "/search_route?from=" + fromInput + "&to=" + toInput + "&submit=true";
}

google.maps.event.addDomListener(window, 'load', initialize);
